import React, { useState } from 'react';
import { Button, Container, Typography, Paper } from '@material-ui/core';
import AddLiquidity from './AddLiquidity';
import RemoveLiquidity from './RemoveLiquidity';
import LiquidityPosition from './LiquidityPosition';
import { commonStyles } from "./style";
import { useAlephiumWallet } from "../hooks/useAlephiumWallet";
import { AlephiumConnectButton } from "@alephium/web3-react";
import { TokenList } from "../utils/dex";

function UserLiquidity() {
  const classes = commonStyles();
  const [showAddLiquidity, setShowAddLiquidity] = useState(false);
  const [selectedTokenA, setSelectedTokenA] = useState(null);
  const [selectedTokenB, setSelectedTokenB] = useState(null);
  const [showRemoveLiquidity, setShowRemoveLiquidity] = useState(false);
  const wallet = useAlephiumWallet()

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

  const userPositions = [
    // Fetch user positions here
    {
      tokenA: TokenList[0],
      tokenB: TokenList[1],
      liquidity: "10",
      feesAccrued: "0.1",
      feesUnclaimed: "0.05"
    },
    {
      tokenA: TokenList[0],
      tokenB: TokenList[2],
      liquidity: "21",
      feesAccrued: "0.5",
      feesUnclaimed: "0"
    }
  ];


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
        {wallet && userPositions.length > 0 ? (
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
            {!wallet && (
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
