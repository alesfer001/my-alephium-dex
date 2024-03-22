import { Box, Card, Container, Paper, Typography, IconButton, Button } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import Collapse from "@material-ui/core/Collapse";
import { useCallback, useEffect, useMemo, useState } from "react";
import ButtonWithLoader from "./ButtonWithLoader";
import TokenSelectDialog from "./TokenSelectDialog";
import NumberTextField from "./NumberTextField";
import { TokenInfo } from '@alephium/token-list'
import {
  removeLiquidity,
  RemoveLiquidityDetails,
  getRemoveLiquidityDetails,
  PairTokenDecimals,
  stringToBigInt,
  bigIntToString
} from "../utils/dex";
import { formatUnits } from "ethers/lib/utils";
import { useAvailableBalances } from "../hooks/useAvailableBalance";
import { useSlippageTolerance } from "../hooks/useSlippageTolerance";
import { useDeadline } from "../hooks/useDeadline";
import { DEFAULT_SLIPPAGE } from "../state/settings/reducer";
import { commonStyles } from "./style";
import { useTokenPairState } from "../state/useTokenPairState";
import { TransactionSubmitted, WaitingForTxSubmission } from "./Transactions";
import { DetailItem } from "./DetailsItem";
import { useHistory } from "react-router-dom";
import { AlephiumConnectButton, useWallet } from "@alephium/web3-react";
import { COLORS } from "../muiTheme";

function RemoveLiquidity({ goBack, tokenInfos }) {
  const classes = commonStyles();
  const [amountInput, setAmountInput] = useState<string | undefined>(undefined)
  const [amount, setAmount] = useState<bigint | undefined>(undefined)
  // const [tokenAInfo, setTokenAInfo] = useState<TokenInfo | undefined>(undefined)
  // const [tokenBInfo, setTokenBInfo] = useState<TokenInfo | undefined>(undefined)
  const [totalLiquidityAmount, setTotalLiquidityAmount] = useState<bigint | undefined>(undefined)
  const [removeLiquidityDetails, setRemoveLiquidityDetails] = useState<RemoveLiquidityDetails | undefined>(undefined)
  const [txId, setTxId] = useState<string | undefined>(undefined)
  const [removingLiquidity, setRemovingLiquidity] = useState<boolean>(false)
  const [slippage,] = useSlippageTolerance()
  const [deadline,] = useDeadline()
  const [error, setError] = useState<string | undefined>(undefined)
  const { connectionStatus, signer, account, explorerProvider } = useWallet()
  const { balance: availableBalance, updateBalanceForTx } = useAvailableBalances()
  const history = useHistory()

  const [tokenAInfo, setTokenAInfo] = useState(tokenInfos.token0Info);
  const [tokenBInfo, setTokenBInfo] = useState(tokenInfos.token1Info);

  const quickSelectOptions = [25, 50, 75, 100];

  const handleQuickSelect = (percentage) => {
    if (totalLiquidityAmount) {
      const selectedAmount = totalLiquidityAmount * BigInt(percentage) / BigInt(100);
      setAmount(selectedAmount);
      const roundedAmountInput = parseFloat(formatUnits(selectedAmount, PairTokenDecimals)).toFixed(2); // Adjust the precision as needed
      setAmountInput(roundedAmountInput);
    }
  };


  const handleTokenAChange = useCallback((tokenInfo) => {
    setTokenAInfo(tokenInfo);
  }, []);

  const handleTokenBChange = useCallback((tokenInfo) => {
    setTokenBInfo(tokenInfo)
  }, []);

  const { tokenPairState, getTokenPairStateError } = useTokenPairState(tokenAInfo, tokenBInfo)

  useEffect(() => {
    setTotalLiquidityAmount(undefined)
    if (tokenPairState !== undefined && getTokenPairStateError === undefined) {
      const balance = availableBalance.get(tokenPairState.tokenPairId)
      setTotalLiquidityAmount(balance === undefined ? 0n : balance)
    }
  }, [tokenPairState, getTokenPairStateError, availableBalance])

  useEffect(() => {
    setRemoveLiquidityDetails(undefined)
    try {
      if (
        tokenPairState !== undefined &&
        tokenAInfo !== undefined &&
        tokenBInfo !== undefined &&
        amount !== undefined &&
        totalLiquidityAmount !== undefined
      ) {
        const result = getRemoveLiquidityDetails(tokenPairState, totalLiquidityAmount, amount)
        setRemoveLiquidityDetails(result)
      }
    } catch (error) {
      setError(`${error}`)
      console.error(`failed to update token amounts: ${error}`)
    }
  }, [tokenPairState, tokenAInfo, tokenBInfo, amount, totalLiquidityAmount])

  const handleAmountChanged = useCallback(
    (event) => {
      setError(undefined)
      setRemoveLiquidityDetails(undefined)
      if (event.target.value === '') {
        setAmount(undefined)
        setAmountInput(undefined)
        return
      }
      setAmountInput(event.target.value)
      try {
        setAmount(stringToBigInt(event.target.value, PairTokenDecimals))
      } catch (error) {
        console.log(`Invalid input: ${event.target.value}, error: ${error}`)
        setError(`${error}`)
      }
    }, []
  )

  const handleMaxButtonClick = () => {
    setError(undefined)
    if (totalLiquidityAmount === undefined) {
      setAmount(undefined)
      setAmountInput(undefined)
      return
    }
    let amount = formatUnits(totalLiquidityAmount, PairTokenDecimals)
    const roundedAmountInput = parseFloat(amount).toFixed(2); // Adjust the precision as needed
    setAmountInput(roundedAmountInput);
    try {
      setAmount(stringToBigInt(amount, PairTokenDecimals))
    } catch (error) {
      console.log(`error: ${error}`)
      setError(`${error}`)
    }
  }

  const redirectToSwap = useCallback(() => {
    setTokenAInfo(undefined)
    setTokenBInfo(undefined)
    setAmount(undefined)
    setAmountInput(undefined)
    setTotalLiquidityAmount(undefined)
    setTxId(undefined)
    setRemovingLiquidity(false)
    setRemoveLiquidityDetails(undefined)
    setError(undefined)
    history.push('/swap')
  }, [history])

  const redirectToPool = useCallback(() => {
    setTokenAInfo(undefined)
    setTokenBInfo(undefined)
    setAmount(undefined)
    setAmountInput(undefined)
    setTotalLiquidityAmount(undefined)
    setTxId(undefined)
    setRemovingLiquidity(false)
    setRemoveLiquidityDetails(undefined)
    setError(undefined)
    goBack()
  }, [])

  const tokenPairContent = (
    <div className={classes.tokenPairContainer}>
      <TokenSelectDialog
        tokenId={tokenAInfo?.id}
        counterpart={tokenBInfo?.id}
        onChange={handleTokenAChange}
        tokenBalances={availableBalance}
        mediumSize={true}
        disabled={true}
      />
      <TokenSelectDialog
        tokenId={tokenBInfo?.id}
        counterpart={tokenAInfo?.id}
        onChange={handleTokenBChange}
        tokenBalances={availableBalance}
        mediumSize={true}
        disabled={true}
      />
    </div>
  )

  const completed = useMemo(() => txId !== undefined, [txId])

  const amountInputBox = (
    <div className={classes.inputRemoveLiquidity}>
      <NumberTextField
        className={classes.numberField}
        value={amountInput !== undefined ? amountInput : ''}
        onChange={handleAmountChanged}
        autoFocus={true}
        InputProps={{ disableUnderline: true }}
        disabled={!!removingLiquidity || !!completed}
        placeholder="0"
      />
      <Typography className={classes.balance}>
        {totalLiquidityAmount ? (<Button className={classes.maxButton}
          onClick={handleMaxButtonClick}
        >
          <svg fill={COLORS.blue} height="24px" width="24px" style={{ marginRight: '8px', marginBottom: '4px' }} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 458.531 458.531" xmlSpace="preserve">
            <g id="XMLID_830_">
              <g>
                <g>
                  <path d="M336.688,343.962L336.688,343.962c-21.972-0.001-39.848-17.876-39.848-39.848v-66.176
                           c0-21.972,17.876-39.847,39.848-39.847h103.83c0.629,0,1.254,0.019,1.876,0.047v-65.922c0-16.969-13.756-30.725-30.725-30.725
                           H30.726C13.756,101.49,0,115.246,0,132.215v277.621c0,16.969,13.756,30.726,30.726,30.726h380.943
                           c16.969,0,30.725-13.756,30.725-30.726v-65.922c-0.622,0.029-1.247,0.048-1.876,0.048H336.688z"/>
                  <path d="M440.518,219.925h-103.83c-9.948,0-18.013,8.065-18.013,18.013v66.176c0,9.948,8.065,18.013,18.013,18.013h103.83
                           c9.948,0,18.013-8.064,18.013-18.013v-66.176C458.531,227.989,450.466,219.925,440.518,219.925z M372.466,297.024
                           c-14.359,0-25.999-11.64-25.999-25.999s11.64-25.999,25.999-25.999c14.359,0,25.999,11.64,25.999,25.999
                           C398.465,285.384,386.825,297.024,372.466,297.024z"/>
                  <path d="M358.169,45.209c-6.874-20.806-29.313-32.1-50.118-25.226L151.958,71.552h214.914L358.169,45.209z" />
                </g>
              </g>
            </g>
          </svg>
          {bigIntToString(totalLiquidityAmount, PairTokenDecimals)}
        </Button>) : " "}
      </Typography>
      {/* <Button
          variant="contained"
          color="primary"
          className={classes.maxButton}
          onClick={handleMaxButtonClick}
          >
          Max
          </Button> */}
    </div>
  )

  const handleRemoveLiquidity = useCallback(async () => {
    try {
      setRemovingLiquidity(true)
      if (
        /* wallet !== undefined && */
        /* wallet.signer.explorerProvider !== undefined && */
        connectionStatus === 'connected' &&
        explorerProvider !== undefined &&
        tokenPairState !== undefined &&
        removeLiquidityDetails !== undefined &&
        tokenAInfo !== undefined &&
        tokenBInfo !== undefined &&
        amount !== undefined
      ) {
        if (amount === 0n) {
          throw new Error('the input amount must be greater than 0')
        }

        const result = await removeLiquidity(
          signer,
          explorerProvider,
          account.address,
          tokenPairState,
          amount,
          removeLiquidityDetails.amount0,
          removeLiquidityDetails.amount1,
          slippage === 'auto' ? DEFAULT_SLIPPAGE : slippage,
          deadline
        )
        console.log(`remove liquidity succeed, tx id: ${result.txId}`)
        setTxId(result.txId)
        updateBalanceForTx(result.txId)
        setRemovingLiquidity(false)
      }
    } catch (error) {
      setError(`${error}`)
      setRemovingLiquidity(false)
      console.error(`failed to remove liquidity, error: ${error}`)
    }
  }, [connectionStatus, signer, account, explorerProvider, tokenPairState, tokenAInfo, tokenBInfo, amount, removeLiquidityDetails, slippage, deadline, updateBalanceForTx])

  const readyToRemoveLiquidity =
    connectionStatus === 'connected' &&
    tokenAInfo !== undefined &&
    tokenBInfo !== undefined &&
    amount !== undefined &&
    totalLiquidityAmount !== undefined &&
    removeLiquidityDetails !== undefined &&
    !removingLiquidity && !completed &&
    error === undefined &&
    getTokenPairStateError === undefined
  const removeLiquidityButton = (
    <ButtonWithLoader
      disabled={!readyToRemoveLiquidity}
      onClick={handleRemoveLiquidity}
      className={
        classes.gradientButton + (!readyToRemoveLiquidity ? " " + classes.disabled : "")
      }
    >
      Remove Liquidity
    </ButtonWithLoader>
  );

  const connectButton = (
    <div className={classes.connectWalletButton}>
      <AlephiumConnectButton label="Connect wallet" />
    </div>
  );

  return (
    <Container className={classes.centeredContainer} maxWidth="sm">
      <Box display="flex" justifyContent="center" alignItems="center" width="100%" position="relative">
        <IconButton onClick={redirectToPool} className={classes.backButton}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" color="textSecondary" className={classes.centerTitle}>
          Remove Liquidity
        </Typography>
        <div></div>
      </Box>
      <div className={classes.spacer} />
      <Paper className={classes.mainPaper}>
        <WaitingForTxSubmission
          open={!!removingLiquidity && !completed}
          text="Removing Liquidity"
        />
        <TransactionSubmitted
          open={!!completed}
          txId={txId!}
          buttonText="Swap Coins"
          onClick={redirectToSwap}
        />
        <div>
          <Collapse in={!removingLiquidity && !completed}>
            {
              <>
                {tokenPairContent}
                <div className={classes.spacer} />
                {totalLiquidityAmount !== undefined ? (
                  <>
                    <div className={classes.notification}>
                      <p className={classes.leftAlign}>Total share amount:</p>
                      <p className={classes.rightAlign}>{bigIntToString(totalLiquidityAmount, PairTokenDecimals)}</p>
                    </div>
                  </>
                ) : null}
                <div>
                  {quickSelectOptions.map((option) => (
                    <Button key={option} onClick={() => handleQuickSelect(option)}>
                      {option}%
                    </Button>
                  ))}
                </div>
                {amountInputBox}
                <>
                  <div className={classes.spacer} />
                  {error === undefined && getTokenPairStateError === undefined
                    ? <RemoveLiquidityDetailsCard details={removeLiquidityDetails} amount={amount} />
                    : null
                  }
                  {error ? (
                    <Typography variant="body2" color="error" className={classes.error}>
                      {error}
                    </Typography>
                  ) : getTokenPairStateError ? (
                    <Typography variant="body2" color="error" className={classes.error}>
                      {getTokenPairStateError}
                    </Typography>
                  ) : null}
                </>
                <div className={classes.spacer} />
                {connectionStatus === 'connected' ? removeLiquidityButton : connectButton}
              </>
            }
          </Collapse>
        </div>
      </Paper>
      <div className={classes.spacer} />
    </Container>
  );
}

function RemoveLiquidityDetailsCard({ details, amount }: { details: RemoveLiquidityDetails | undefined, amount: bigint | undefined }) {
  if (details === undefined || amount === undefined) {
    return null
  }
  const { state, remainShareAmount, remainSharePercentage } = details
  const getTokenAmount = (tokenInfo: TokenInfo): string => {
    const tokenAmount = tokenInfo.id === details.token0Id ? details.amount0 : details.amount1
    return bigIntToString(tokenAmount, tokenInfo.decimals)
  }
  return <Card variant='outlined' style={{ width: '100%', padding: '0', borderRadius: '10px' }}>
    <div style={{ display: 'grid', gridAutoRows: 'auto', gridRowGap: '5px', paddingTop: '10px', paddingBottom: '10px' }}>
      <DetailItem
        itemName={`The number of ${state.token0Info.symbol} you will receive:`}
        itemValue={`${getTokenAmount(state.token0Info)} ${state.token0Info.symbol}`}
      />
      <DetailItem
        itemName={`The number of ${state.token1Info.symbol} you will receive:`}
        itemValue={`${getTokenAmount(state.token1Info)} ${state.token1Info.symbol}`}
      />
      <DetailItem
        itemName={'Remain share amount:'}
        itemValue={`${bigIntToString(remainShareAmount, PairTokenDecimals)}`}
      />
      <DetailItem
        itemName={`Remain share percentage:`}
        itemValue={`${remainSharePercentage} %`}
      />
    </div>
  </Card>
}

export default RemoveLiquidity;
