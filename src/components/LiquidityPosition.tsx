import React from 'react';
import { Button, Grid, Typography, Card, CardContent, Box } from '@material-ui/core';

function LiquidityPosition({ position, onAdd, onRemove }) {
  return (
    <Card variant="outlined" style={{ marginBottom: '10px' }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">
              {position.tokenA.name}/{position.tokenB.name}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Liquidity:</Typography>
            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
              {position.liquidity} $
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Fees Unclaimed:</Typography>
            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
              {position.feesUnclaimed} $
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center" justifyContent="center" height="100%">
              <Typography variant="body2" color="textSecondary">
                Fees Accrued: {position.feesAccrued} $
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" color="primary" disabled={position.feesUnclaimed <= 0}>
              Claim
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Button variant="outlined" color="primary" onClick={() => onAdd(position)}>
                Add
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => onRemove(position)} style={{ marginLeft: '10px' }}>
                Remove
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default LiquidityPosition;
