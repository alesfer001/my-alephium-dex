import React, { useState } from 'react';
import { Button, Container, Typography, Paper } from '@material-ui/core';
import AddLiquidity from './AddLiquidity';
import RemoveLiquidity from './RemoveLiquidity';
import LiquidityPosition from './LiquidityPosition';
import { commonStyles } from "./style";
import { useAlephiumWallet } from "../hooks/useAlephiumWallet";
import { AlephiumConnectButton } from "@alephium/web3-react";

function UserLiquidity() {
  const classes = commonStyles();
  const [showAddLiquidity, setShowAddLiquidity] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const wallet = useAlephiumWallet()

  const handleAddLiquidity = (position) => {
    setShowAddLiquidity(position);
  };

  const handleRemoveLiquidity = (position) => {
    setSelectedPosition(position);
  };

  if (showAddLiquidity) {
    return <AddLiquidity goBack={() => setShowAddLiquidity(false) } />;
  }

  if (selectedPosition) {
    return <RemoveLiquidity position={selectedPosition} />;
  }

  const userPositions = [
    // Fetch user positions here
    {
      tokenA: "ALPH",
      tokenB: "BTC",
      liquidity: "10",
      feesAccrued: "0.1",
      feesUnclaimed: "0.05"
    },
    {
      tokenA: "ALPH",
      tokenB: "ETH",
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
        <Button variant="contained" color="primary" onClick={handleAddLiquidity}>
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
              onAdd={handleAddLiquidity}
              onRemove={handleRemoveLiquidity}
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
