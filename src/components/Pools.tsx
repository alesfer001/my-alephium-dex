import { Container, Paper, Typography, Card, Button } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import { useState, useCallback, useEffect } from "react";
import { bigIntToString, PairTokenDecimals, TokenPairState, getTokenPairState } from "../utils/dex";
import { commonStyles } from "./style";
import { TokenInfo } from "@alephium/token-list";
import { useTokenPairState } from "../state/useTokenPairState";
import TokenSelectDialog from "./TokenSelectDialog";
import { useAvailableBalances } from "../hooks/useAvailableBalance";
import { DetailItem } from "./DetailsItem";
import BigNumber from "bignumber.js";
import AddPool from './AddPool';
import { useWallet } from "@alephium/web3-react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@material-ui/core';
import axios from "axios";

import { TokenList } from "../utils/dex";
import AddLiquidity from "./AddLiquidity";
import RemoveLiquidity from "./RemoveLiquidity";

interface Pool {
  token0Info: TokenInfo,
  token1Info: TokenInfo,
  pool: string,
  fee: string,
  tvl: string,
  volume24h: string,
  volume7d: string,
  share: string
}

function Pool() {
  const commonClasses = commonStyles()
  const [showAddPool, setShowAddPool] = useState(false);
  const [tokenAInfo, setTokenAInfo] = useState<TokenInfo | undefined>(undefined)
  const [tokenBInfo, setTokenBInfo] = useState<TokenInfo | undefined>(undefined)
  const { tokenPairState, getTokenPairStateError } = useTokenPairState(tokenAInfo, tokenBInfo)
  const { connectionStatus } = useWallet()
  const { balance } = useAvailableBalances()

  const [response, setResponse] = useState<TokenPairState | null>(null);
  const [pools, setPools] = useState<Pool[]>([])

  const [openComponent, setOpenComponent] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<string>("");

  function findTokenById(tokenId) {
    return TokenList.find(token => token.id === tokenId);
  }

  const [tokenPairs, setTokenPairs] = useState([]);

  useEffect(() => {
    const tokenPairsStr = process.env.REACT_APP_POOL_TOKEN_PAIRS;
    if (tokenPairsStr) {
      try {
        const tokenPairsArray = JSON.parse(tokenPairsStr);
        setTokenPairs(tokenPairsArray);
      } catch (error) {
        console.error("Failed to parse token pairs environment variable:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchTokenPairStates = async () => {
      let newRows: Pool[] = []; // Temporary array to hold the new state

      for (const pair of tokenPairs) {
        const token0 = findTokenById(pair["token0_id"]);
        const token1 = findTokenById(pair["token1_id"]);

        if (token0 !== undefined && token1 !== undefined) {
          const response = await getTokenPairState(token0, token1);

          let poolTokenBalance = balance.get(response.tokenPairId) ?? 0n;
          let sharePercentage = BigNumber((poolTokenBalance * 100n).toString()).div(BigNumber(response.totalSupply.toString())).toFixed(5);

          let fetchPrice = async (tokenId) => {
            tokenId = tokenId.toLowerCase()
            try {
              const response = await axios.get(
                `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`
              );
              const price = response.data[tokenId].usd;
              return price
            } catch (error) {
              console.error("Error fetching price:", error);
              return "1"
            }
          }

          let token0price = await fetchPrice(response.token0Info.name)
          let token1price = await fetchPrice(response.token1Info.name)

          const reserve0Adjusted = bigIntToString(response.reserve0, response.token0Info.decimals).replace(/,/g, '')
          const reserve1Adjusted = bigIntToString(response.reserve1, response.token1Info.decimals).replace(/,/g, '')

          const TVL = (parseInt(reserve0Adjusted) * token0price) + (parseInt(reserve1Adjusted) * token1price);

          newRows.push({
            token0Info: response.token0Info,
            token1Info: response.token1Info,
            pool: `${response.token0Info.symbol}/${response.token1Info.symbol}`,
            fee: `?%`,
            tvl: `${TVL}$`,
            volume24h: "?",
            volume7d: "?",
            share: sharePercentage != 'NaN' ? sharePercentage : '0'
          });
        }
      }

      setPools(newRows); // Update state once with the final result
    };

    setPools([]); // Reset pools at the beginning of the effect
    fetchTokenPairStates();
  }, [tokenPairs, balance]); // Ensure balance and tokenPairs are in the dependency array if they are used or changed outside

  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');
  const [valueToOrderBy, setValueToOrderBy] = useState('tvl');

  const handleAddPool = () => {
    setShowAddPool(true);
  };

  const handleRequestSort = (property) => {
    const isAscending = (valueToOrderBy === property && orderDirection === 'asc');
    setValueToOrderBy(property);
    setOrderDirection(isAscending ? 'desc' : 'asc');
    // Implement the logic to sort your data based on the property and direction
  };


  const handleTokenAChange = useCallback((tokenInfo) => {
    setTokenAInfo(tokenInfo)
  }, [])

  const handleTokenBChange = useCallback((tokenInfo) => {
    setTokenBInfo(tokenInfo)
  }, [])

  const tokenPairContent = (
    <div className={commonClasses.tokenPairContainer}>
      <TokenSelectDialog
        tokenId={tokenAInfo?.id}
        counterpart={tokenBInfo?.id}
        onChange={handleTokenAChange}
        tokenBalances={balance}
        mediumSize={true}
      />
      <TokenSelectDialog
        tokenId={tokenBInfo?.id}
        counterpart={tokenAInfo?.id}
        onChange={handleTokenBChange}
        tokenBalances={balance}
        mediumSize={true}
      />
    </div>
  )

  if (showAddPool) {
    return <AddPool
      goBack={() => {
        setShowAddPool(false);
      }}
    />;
  }

  const openAddLiquidity = (row) => {
    setSelectedRow(row);
    setOpenComponent('AddLiquidity');
  };

  const openRemoveLiquidity = (row) => {
    setSelectedRow(row);
    setOpenComponent('RemoveLiquidity');
  };

  if (openComponent == 'AddLiquidity') {
    return <AddLiquidity
      goBack={() => {
        setOpenComponent('')
      }}
      tokenInfos = {selectedRow}
    />
  }

  if (openComponent == 'RemoveLiquidity') {
    return <RemoveLiquidity
      goBack={() => {
        setOpenComponent('')
      }}
      tokenInfos = {selectedRow}
    />
  }

  return (
    <Container className={commonClasses.centeredContainer} maxWidth="sm">
      <div className={commonClasses.swapTitle}>
        <Typography variant="h5" color="textSecondary">
          Existing Pools
        </Typography>
        <Button
          className={commonClasses.addLiquidityButton}
          variant="contained"
          color="primary"
          onClick={() => handleAddPool()}>
          Add Pool
        </Button>
      </div>
      <div className={commonClasses.spacer} />
      <Paper className={commonClasses.mainPaper}>
        <div>
          <Collapse in={true}>
            {
              <>
                {tokenPairContent}
                <div className={commonClasses.spacer} />
                <div className={commonClasses.spacer} />
                {getTokenPairStateError ? (
                  (
                    <Typography variant="body2" color="error" className={commonClasses.error}>
                      {getTokenPairStateError}
                    </Typography>
                  )
                ) : <PoolDetailsCard state={tokenPairState} balance={balance} />}
              </>
            }
          </Collapse>
        </div>

      </Paper>
      <div className={commonClasses.poolList}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                #
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={valueToOrderBy === 'pool'}
                  direction={valueToOrderBy === 'pool' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('pool')}
                >
                  Pool
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={valueToOrderBy === 'fee'}
                  direction={valueToOrderBy === 'fee' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('fee')}
                >
                  Fee
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={valueToOrderBy === 'tvl'}
                  direction={valueToOrderBy === 'tvl' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('tvl')}
                >
                  TVL
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={valueToOrderBy === 'volume24h'}
                  direction={valueToOrderBy === 'volume24h' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('volume24h')}
                >
                  Volume 24H
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={valueToOrderBy === 'volume7d'}
                  direction={valueToOrderBy === 'volume7d' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('volume7d')}
                >
                  Volume 7D
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={valueToOrderBy === 'share'}
                  direction={valueToOrderBy === 'share' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('share')}
                >
                  Pool share
                </TableSortLabel>
              </TableCell>
              <TableCell>
                Liquidity
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pools.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.pool}</TableCell>
                <TableCell>{row.fee}</TableCell>
                <TableCell>{row.tvl}</TableCell>
                <TableCell>{row.volume24h}</TableCell>
                <TableCell>{row.volume7d}</TableCell>
                <TableCell>{row.share}%</TableCell>
                <TableCell>
                  <Button onClick={() => openAddLiquidity(row)}>Add Liquidity</Button>
                  {(Number(row.share)) > 0 && <Button onClick={() => openRemoveLiquidity(row)}>Remove Liquidity</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}

function PoolDetailsCard({ state, balance }: { state: TokenPairState | undefined, balance: Map<string, bigint> }) {
  if (state === undefined) {
    return null
  }

  const poolTokenBalance = balance.get(state.tokenPairId) ?? 0n
  const sharePecentage = BigNumber((poolTokenBalance * 100n).toString()).div(BigNumber(state.totalSupply.toString())).toFixed(5)
  return <Card variant='outlined' style={{ width: '100%', padding: '0', borderRadius: '10px' }}>
    <div style={{ display: 'grid', gridAutoRows: 'auto', gridRowGap: '5px', paddingTop: '10px', paddingBottom: '10px' }}>
      <DetailItem
        itemName={`Pooled ${state.token0Info.symbol}:`}
        itemValue={`${bigIntToString(state.reserve0, state.token0Info.decimals)} ${state.token0Info.symbol}`}
      />
      <DetailItem
        itemName={`Pooled ${state.token1Info.symbol}:`}
        itemValue={`${bigIntToString(state.reserve1, state.token1Info.decimals)} ${state.token1Info.symbol}`}
      />
      <DetailItem
        itemName={'Liquidity token total supply:'}
        itemValue={`${bigIntToString(state.totalSupply, PairTokenDecimals)}`}
      />
      <DetailItem
        itemName={'Your total pool tokens:'}
        itemValue={`${bigIntToString(poolTokenBalance, PairTokenDecimals)}`}
      />
      <DetailItem
        itemName={'Your pool share:'}
        itemValue={state.totalSupply === 0n ? '0 %' : `${parseFloat(sharePecentage)} %`}
      />
    </div>
  </Card>
}

export default Pool;
