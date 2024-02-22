import { Card, Container, Paper, Typography, Button, IconButton, Box } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import Collapse from "@material-ui/core/Collapse";
import { useCallback, useMemo, useState, useEffect } from "react";
import ButtonWithLoader from "./ButtonWithLoader";
import TokenSelectDialog from "./TokenSelectDialog";
import NumberTextField from "./NumberTextField";
import { addLiquidity, bigIntToString, PairTokenDecimals, minimalAmount, AddLiquidityDetails, tryGetBalance } from "../utils/dex";
import { useAvailableBalances } from "../hooks/useAvailableBalance";
import { useSlippageTolerance } from "../hooks/useSlippageTolerance";
import { useDeadline } from "../hooks/useDeadline";
import { DEFAULT_SLIPPAGE } from "../state/settings/reducer";
import { useDispatch, useSelector } from 'react-redux'
import { reset, selectTokenA, selectTokenB, typeInput } from "../state/mint/actions";
import { useDerivedMintInfo } from "../state/mint/hooks";
import { selectMintState } from "../state/mint/selectors";
import { commonStyles } from "./style";
import { useHistory } from "react-router-dom";
import { TransactionSubmitted, WaitingForTxSubmission } from "./Transactions";
import { DetailItem } from "./DetailsItem";
import { useWallet } from "@alephium/web3-react";

function AddLiquidity() {
  const classes = commonStyles();
  const [txId, setTxId] = useState<string | undefined>(undefined)
  const [addingLiquidity, setAddingLiquidity] = useState<boolean>(false)
  const [slippage,] = useSlippageTolerance()
  const [deadline,] = useDeadline()
  const dispatch = useDispatch()
  const [error, setError] = useState<string | undefined>(undefined)

  const { signer, account, connectionStatus, explorerProvider } = useWallet()
  const { balance, updateBalanceForTx } = useAvailableBalances()
  const history = useHistory()

  const handleTokenAChange = useCallback((tokenInfo) => {
    dispatch(selectTokenA(tokenInfo))
  }, [dispatch]);

  const handleTokenBChange = useCallback((tokenInfo) => {
    dispatch(selectTokenB(tokenInfo))
  }, [dispatch]);

  const { tokenAInfo, tokenBInfo } = useSelector(selectMintState)
  const { tokenAInput, tokenBInput, tokenAAmount, tokenBAmount, tokenPairState, addLiquidityDetails } = useDerivedMintInfo(setError)

  const handleTokenAAmountChange = useCallback((event) => {
    const hasLiquidity = tokenPairState !== undefined && tokenPairState.reserve0 > 0n
    dispatch(typeInput({ type: 'TokenA', value: event.target.value, hasLiquidity }))
  }, [dispatch, tokenPairState])

  const handleTokenBAmountChange = useCallback((event) => {
    const hasLiquidity = tokenPairState !== undefined && tokenPairState.reserve0 > 0n
    dispatch(typeInput({ type: 'TokenB', value: event.target.value, hasLiquidity }))
  }, [dispatch, tokenPairState])

  const completed = useMemo(() => txId !== undefined, [txId])

  const redirectToSwap = useCallback(() => {
    dispatch(reset())
    setTxId(undefined)
    setAddingLiquidity(false)
    setError(undefined)
    history.push('/swap')
  }, [history])

  const tokenABalance = useMemo(() => {
    return tryGetBalance(balance, tokenAInfo)
  }, [balance, tokenAInfo])

  const tokenBBalance = useMemo(() => {
    return tryGetBalance(balance, tokenBInfo)
  }, [balance, tokenBInfo])

  const handleMaxAButtonClick = () => {
    const hasLiquidity = tokenPairState !== undefined && tokenPairState.reserve0 > 0n
    if (tokenABalance) {
      const intValue = parseInt(tokenABalance.split(',').join(''), 10);
      const valueStr = isNaN(intValue) ? '0' : intValue.toString();

      dispatch(typeInput({ type: 'TokenA', value: valueStr, hasLiquidity }))
    }
    else {
      console.log("tokenABalance is undefined");
      dispatch(typeInput({ type: 'TokenA', value: '0', hasLiquidity }));
    }
  };

  const handleMaxBButtonClick = () => {
    const hasLiquidity = tokenPairState !== undefined && tokenPairState.reserve0 > 0n
    if (tokenBBalance) {
      const intValue = parseInt(tokenBBalance.split(',').join(''), 10);
      const valueStr = isNaN(intValue) ? '0' : intValue.toString();

      dispatch(typeInput({ type: 'TokenB', value: valueStr, hasLiquidity }))
    }
    else {
      console.log("tokenBBalance is undefined");
      dispatch(typeInput({ type: 'TokenB', value: '0', hasLiquidity }));
    }
  };

  const sourceContent = (
    <div className={classes.tokenContainerWithBalance}>
      <div className={classes.inputRow}>
        <div className={classes.inputWithMaxButton}>
          <NumberTextField
            className={classes.numberField}
            value={tokenAInput !== undefined ? tokenAInput : ''}
            onChange={handleTokenAAmountChange}
            autoFocus={true}
            InputProps={{ disableUnderline: true }}
            disabled={!!addingLiquidity || !!completed}
            placeholder="0"
          />
        </div>
        <TokenSelectDialog
          tokenId={tokenAInfo?.id}
          counterpart={tokenBInfo?.id}
          onChange={handleTokenAChange}
          tokenBalances={balance}
        />
      </div>
      <Typography className={classes.balance}>
        {tokenABalance ? `Balance: ${tokenABalance} ${tokenAInfo?.symbol}` : " "}
        {tokenABalance ? (<Button className={classes.maxButton}
                                   onClick={handleMaxAButtonClick}
                           >Max</Button>) : " "}
      </Typography>
    </div>
  );
  const targetContent = (
    <div className={classes.tokenContainerWithBalance}>
      <div className={classes.inputRow}>
        <div className={classes.inputWithMaxButton}>
          <NumberTextField
            className={classes.numberField}
            value={tokenBInput !== undefined ? tokenBInput : ''}
            onChange={handleTokenBAmountChange}
            InputProps={{ disableUnderline: true }}
            disabled={!!addingLiquidity || !!completed}
            placeholder="0"
          />
        </div>
        <TokenSelectDialog
          tokenId={tokenBInfo?.id}
          counterpart={tokenAInfo?.id}
          onChange={handleTokenBChange}
          tokenBalances={balance}
        />
      </div>
      <Typography className={classes.balance}>
        {tokenBBalance ? `Balance: ${tokenBBalance} ${tokenBInfo?.symbol}` : " "}
        {tokenBBalance ? (<Button className={classes.maxButton}
                                  onClick={handleMaxBButtonClick}
                          >Max</Button>) : " "}
      </Typography>
    </div>
  );

  const handleAddLiquidity = useCallback(async () => {
    try {
      setAddingLiquidity(true)
      if (
        /* wallet !== undefined &&
         * wallet.signer.explorerProvider !== undefined && */
        connectionStatus === 'connected' &&
        explorerProvider !== undefined &&
        tokenPairState !== undefined &&
        tokenAInfo !== undefined &&
        tokenBInfo !== undefined &&
        tokenAAmount !== undefined &&
        tokenBAmount !== undefined
      ) {
        const result = await addLiquidity(
          balance,
          signer,
          explorerProvider,
          account.address,
          tokenPairState,
          tokenAInfo,
          tokenBInfo,
          tokenAAmount,
          tokenBAmount,
          slippage === 'auto' ? DEFAULT_SLIPPAGE : slippage,
          deadline
        )
        console.log(`add liquidity succeed, tx id: ${result.txId}`)
        setTxId(result.txId)
        updateBalanceForTx(result.txId)
        setAddingLiquidity(false)
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("User abort")) {
        console.log("Add Liquidity aborted by the user")
      }
      else {
        setError(`${error}`)
      }
      setAddingLiquidity(false)
      console.error(`failed to add liquidity, error: ${error}`)
    }
  }, [connectionStatus, explorerProvider, signer, account, tokenPairState, tokenAInfo, tokenBInfo, tokenAAmount, tokenBAmount, slippage, deadline, balance, updateBalanceForTx])

  const readyToAddLiquidity =
    connectionStatus === 'connected' &&
    tokenAInfo !== undefined &&
    tokenBInfo !== undefined &&
    tokenAAmount !== undefined &&
    tokenBAmount !== undefined &&
    !addingLiquidity && !completed && 
    error === undefined
  const addLiquidityButton = (
    <ButtonWithLoader
      disabled={!readyToAddLiquidity}
      onClick={handleAddLiquidity}
      className={
        classes.gradientButton + (!readyToAddLiquidity ? " " + classes.disabled : "")
      }
    >
      {connectionStatus === 'connected' ? "Add Liquidity" : "Your wallet is not connected"}
    </ButtonWithLoader>
  );

  return (
    <Container className={classes.centeredContainer} maxWidth="sm">
      {/* <Box display="flex" justifyContent="center" alignItems="center" width="100%" position="relative">
          <Typography variant="h5" color="textSecondary" className={classes.centerTitle}>
          Add Liquidity
          </Typography>
          <div></div>
          </Box> */}
      <div className={classes.spacer} />
      <Paper className={classes.mainPaper}>
        <WaitingForTxSubmission
          open={!!addingLiquidity && !completed}
          text="Adding Liquidity"
        />
        <TransactionSubmitted
          open={!!completed}
          txId={txId!}
          buttonText="Swap Coins"
          onClick={redirectToSwap}
        />
        <div>
          <Collapse in={!addingLiquidity && !completed}>
            {
              <>
                {sourceContent}
                <div className={classes.spacer} />
                {targetContent}
                {error ? (
                  <Typography variant="body2" color="error" className={classes.error}>
                    {error}
                  </Typography>
                ) : null}
                <div className={classes.spacer} />
              </>
            }
            <AddLiquidityDetailsCard details={addLiquidityDetails} slippage={slippage === 'auto' ? DEFAULT_SLIPPAGE : slippage}></AddLiquidityDetailsCard>
            {addLiquidityButton}
          </Collapse>
        </div>
      </Paper>
      <div className={classes.spacer} />
    </Container>
  );
}

function AddLiquidityDetailsCard({ details, slippage } : { details: AddLiquidityDetails | undefined, slippage: number }) {
  if (details === undefined) {
    return null
  }

  const { state, tokenAId, shareAmount, sharePercentage, amountA, amountB } = details
  const [tokenA, tokenB] = tokenAId === state.token0Info.id
      ? [{ info: state.token0Info, amount: amountA }, { info: state.token1Info, amount: amountB }]
      : [{ info: state.token1Info, amount: amountA }, { info: state.token0Info, amount: amountB }]
  return <Card variant='outlined' style={{ width: '100%', padding: '0', borderRadius: '10px' }}>
    <div style={{ display: 'grid', gridAutoRows: 'auto', gridRowGap: '5px', paddingTop: '10px', paddingBottom: '10px' }}>
      <DetailItem
        itemName='Liquidity token amount:'
        itemValue={`${bigIntToString(shareAmount, PairTokenDecimals)}`}
      />
      <DetailItem
        itemName='Share percentage:'
        itemValue={`${sharePercentage} %`}
      />
      <DetailItem
        itemName={`Minimal amount of ${tokenA.info.symbol} after slippage:`}
        itemValue={`${bigIntToString(minimalAmount(tokenA.amount, slippage), tokenA.info.decimals)} ${tokenA.info.symbol}`}
      />
      <DetailItem
        itemName={`Minimal amount of ${tokenB.info.symbol} after slippage:`}
        itemValue={`${bigIntToString(minimalAmount(tokenB.amount, slippage), tokenB.info.decimals)} ${tokenB.info.symbol}`}
      />
    </div>
  </Card>
}

export default AddLiquidity;
