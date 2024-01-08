import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Paper } from '@material-ui/core';
import AddLiquidity from './AddLiquidity';
import RemoveLiquidity from './RemoveLiquidity';
import LiquidityPosition from './LiquidityPosition';
import { commonStyles } from "./style";
import { useAvailableBalances } from "../hooks/useAvailableBalance";
import { AlephiumConnectButton } from "@alephium/web3-react";
import { TokenList, bigIntToString, PairTokenDecimals } from "../utils/dex";
import { useTokenPairState } from "../state/useTokenPairState";
import { TokenInfo } from "@alephium/token-list";
import BigNumber from "bignumber.js";
import { useWallet } from "@alephium/web3-react";

type Position = {
    tokenA: TokenInfo;
    tokenB: TokenInfo;
    poolTokenBalance: string;
    sharePercentage: number;
}

function UserLiquidity() {
  const classes = commonStyles();
  const [showAddLiquidity, setShowAddLiquidity] = useState(false);
  const [selectedTokenA, setSelectedTokenA] = useState(null);
  const [selectedTokenB, setSelectedTokenB] = useState(null);
  const [showRemoveLiquidity, setShowRemoveLiquidity] = useState(false);

  const { signer, account, connectionStatus, explorerProvider } = useWallet()
  const { balance, updateBalanceForTx } = useAvailableBalances()

  const handleAddLiquidity = (tokenA, tokenB) => {
    setSelectedTokenA(tokenA);
    setSelectedTokenB(tokenB);
    setShowAddLiquidity(true);
  };

  const handleRemoveLiquidity = (tokenA, tokenB) => {
    setSelectedTokenA(tokenA);
    setSelectedTokenB(tokenB);
    setShowRemoveLiquidity(true);
  };

  // Need to loop over positions or tokens here
  const { tokenPairState, getTokenPairStateError } = useTokenPairState(TokenList[0], TokenList[1])
  const [userPositions, setUserPositions] = useState<Position[]>([])

  useEffect(() => {
    if(tokenPairState) {
      const poolTokenBalance = balance.get(tokenPairState.tokenPairId) ?? 0n;
      const sharePecentage = BigNumber((poolTokenBalance * 100n).toString()).div(BigNumber(tokenPairState.totalSupply.toString())).toFixed(5);
      const userPosition = {
        tokenA: TokenList[0],
        tokenB: TokenList[1],
        poolTokenBalance: bigIntToString(poolTokenBalance, PairTokenDecimals),
        sharePercentage: parseFloat(sharePecentage),
      };
      if(userPositions.length === 0 || JSON.stringify(userPositions[0]) !== JSON.stringify(userPosition)) {
        setUserPositions([userPosition]);
      }
    }
  }, [tokenPairState, balance]);

  if (showAddLiquidity) {
    return <AddLiquidity
             selectedTokenA={selectedTokenA}
             selectedTokenB={selectedTokenB}
             goBack={() => {
               setShowAddLiquidity(false);
               setSelectedTokenA(null);
               setSelectedTokenB(null);
             }}
           />;
  }

  if (showRemoveLiquidity) {
    return <RemoveLiquidity
             selectedTokenA={selectedTokenA}
             selectedTokenB={selectedTokenB}
             goBack={() => {
               setShowRemoveLiquidity(false);
               setSelectedTokenA(null);
               setSelectedTokenB(null);
             }}
           />;
  }

  return (
    <Container className={classes.centeredContainer} maxWidth="sm">
      <div className={classes.swapTitle}>
        <Typography variant="h5" color="textSecondary">
          Liquidity Positions
        </Typography>
        <Button
          className={classes.addLiquidityButton}
          variant="contained"
          color="primary"
          onClick={() => handleAddLiquidity(null, null)}>
          Add Liquidity
        </Button>
      </div>
      <div className={classes.spacer} />
      <Paper className={classes.mainPaper}>
        {connectionStatus === 'connected' && userPositions.length > 0 ? (
          userPositions.map((position, index) => (
            <LiquidityPosition
              key={index}
              position={position}
              onAdd={() => handleAddLiquidity(position.tokenA, position.tokenB)}
              onRemove={() => handleRemoveLiquidity(position.tokenA, position.tokenB)}
            />
          ))) : (
          <>
            <Typography variant="body2">
              Your active liquidity positions will appear here.
            </Typography>
            {connectionStatus !== 'connected' && (
              <div className={classes.centeredButton}>
                <AlephiumConnectButton />
              </div>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
}

export default UserLiquidity;
