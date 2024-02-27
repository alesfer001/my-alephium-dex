import { Card, Container, Paper, Typography, Button } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import { useCallback, useState, useMemo } from "react";
import ButtonWithLoader from "./ButtonWithLoader";
import TokenSelectDialog from "./TokenSelectDialog";
import HoverIcon from "./HoverIcon";
import NumberTextField from "./NumberTextField";
import { bigIntToString, getSwapDetails, swap, SwapDetails, tryGetBalance } from "../utils/dex";
import { useAvailableBalances } from "../hooks/useAvailableBalance";
import { useDeadline } from "../hooks/useDeadline";
import { useSlippageTolerance } from "../hooks/useSlippageTolerance";
import { DEFAULT_SLIPPAGE } from "../state/settings/reducer";
import { useDispatch, useSelector } from 'react-redux'
import { reset, selectTokenIn, selectTokenOut, switchTokens, typeInput } from "../state/swap/actions";
import { useDerivedSwapInfo } from "../state/swap/hooks";
import { selectSwapState } from "../state/swap/selectors";
import { commonStyles } from "./style";
import { TransactionSubmitted, WaitingForTxSubmission } from "./Transactions";
import BigNumber from "bignumber.js";
import { DetailItem } from "./DetailsItem";
import TransactionSettings from "../components/Settings";
import { TokenList } from "../utils/dex";
import { useEffect } from 'react';
import { AlephiumConnectButton, useWallet } from "@alephium/web3-react";
import walletIcon from "../../images/wallet-icon.svg";
import { COLORS } from "../muiTheme";

function Swap() {
  const classes = commonStyles();
  const [txId, setTxId] = useState<string | undefined>(undefined)
  const [swapping, setSwapping] = useState<boolean>(false)
  const dispatch = useDispatch()
  const [error, setError] = useState<string | undefined>(undefined)
  const [slippage,] = useSlippageTolerance()
  const [deadline,] = useDeadline()

  useEffect(() => {
      dispatch(selectTokenIn(TokenList[0]));
  }, []);
  const { connectionStatus, signer, account, explorerProvider } = useWallet()
  const { balance, updateBalanceForTx } = useAvailableBalances()

  const handleTokenInChange = useCallback((tokenInfo) => {
    dispatch(selectTokenIn(tokenInfo))
  }, [dispatch]);

  const handleTokenOutChange = useCallback((tokenInfo) => {
    dispatch(selectTokenOut(tokenInfo))
  }, [dispatch]);

  const { tokenInInfo, tokenOutInfo } = useSelector(selectSwapState)
  const { tokenInInput, tokenOutInput, tokenInAmount, tokenOutAmount, tokenPairState, swapType } = useDerivedSwapInfo(setError)

  const swapDetails = useMemo(() => {
    if (
      swapType === undefined ||
      tokenPairState === undefined ||
      tokenInAmount === undefined ||
      tokenOutAmount === undefined ||
      tokenInInfo === undefined ||
      tokenOutInfo === undefined
    ) {
      return undefined
    }
    const slippageTolerance = slippage === 'auto' ? DEFAULT_SLIPPAGE : slippage
    return getSwapDetails(swapType, tokenPairState, tokenInInfo, tokenOutInfo, tokenInAmount, tokenOutAmount, slippageTolerance)
  }, [tokenInAmount, tokenOutAmount, tokenPairState, swapType, tokenInInfo, tokenOutInfo, slippage])

  const handleTokenInAmountChange = useCallback((event) => {
    dispatch(typeInput({ type: 'TokenIn', value: event.target.value }))
  }, [dispatch])

  const handleTokenOutAmountChange = useCallback((event) => {
    dispatch(typeInput({ type: 'TokenOut', value: event.target.value }))
  }, [dispatch])

  const switchCallback = useCallback(() => {
    dispatch(switchTokens())
  }, [dispatch]);

  const handleReset = useCallback(() => {
    dispatch(reset())
    setTxId(undefined)
    setSwapping(false)
    setError(undefined)
  }, [dispatch])

  const tokenInBalance = useMemo(() => {
    return tryGetBalance(balance, tokenInInfo)
  }, [balance, tokenInInfo])

  const tokenOutBalance = useMemo(() => {
    return tryGetBalance(balance, tokenOutInfo)
  }, [balance, tokenOutInfo])

  const completed = useMemo(() => txId !== undefined, [txId])

  const handleMaxButtonClick = () => {
    if (tokenInBalance) {
      const intValue = parseInt(tokenInBalance.split(',').join(''), 10);
      const valueStr = isNaN(intValue) ? '0' : intValue.toString();

      dispatch(typeInput({ type: 'TokenIn', value: valueStr }))
    }
    else {
      console.log("tokenInBalance is undefined");
      dispatch(typeInput({ type: 'TokenIn', value: '0' }));
    }
  };

  const sourceContent = (
    <div className={classes.tokenContainerWithBalance}>
      <div className={classes.inputRow}>
        <div className={classes.inputWithMaxButton}>
          <NumberTextField
            className={classes.numberField}
            value={tokenInInput !== undefined ? tokenInInput : ''}
            onChange={handleTokenInAmountChange}
            autoFocus={true}
            InputProps={{ disableUnderline: true }}
            disabled={!!swapping || !!completed}
            placeholder="0"
          />
        </div>
      <TokenSelectDialog
        tokenId={tokenInInfo?.id}
        counterpart={tokenOutInfo?.id}
        onChange={handleTokenInChange}
        tokenBalances={balance}
    />
      </div>
      <Typography className={classes.balance}>
        {tokenInBalance ? (<Button className={classes.maxButton}
                                   onClick={handleMaxButtonClick}
                           >
          <svg fill={COLORS.blue} height="24px" width="24px" style={{marginRight: '8px', marginBottom: '4px'}} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
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
                  <path d="M358.169,45.209c-6.874-20.806-29.313-32.1-50.118-25.226L151.958,71.552h214.914L358.169,45.209z"/>
                </g>
              </g>
            </g>
          </svg>
          {tokenInBalance}</Button>) : " "}
      </Typography>
    </div>
  );
  const middleButton = <HoverIcon onClick={switchCallback} />;
  const targetContent = (
    <div className={classes.tokenContainerWithBalance}>
      <div className={classes.inputRow}>
        <div className={classes.inputWithMaxButton}>
          <NumberTextField
            className={classes.numberField}
            value={tokenOutInput !== undefined ? tokenOutInput : ''}
            onChange={handleTokenOutAmountChange}
            InputProps={{ disableUnderline: true }}
            disabled={!!swapping || !!completed}
            placeholder="0"
          />
        </div>
        <TokenSelectDialog
          tokenId={tokenOutInfo?.id}
          counterpart={tokenInInfo?.id}
          onChange={handleTokenOutChange}
          tokenBalances={balance}
        />
      </div>
        <Typography className={classes.balance}>
          {tokenOutBalance ?
           (<Button className={classes.walletDisplay}
            >
             <svg fill={COLORS.white} height="24px" width="24px" style={{marginRight: '8px', marginBottom: '4px'}} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
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
                  <path d="M358.169,45.209c-6.874-20.806-29.313-32.1-50.118-25.226L151.958,71.552h214.914L358.169,45.209z"/>
                </g>
              </g>
            </g>
          </svg>
          {tokenOutBalance}</Button>)
          : " "}
        </Typography>
    </div>
  );

  const handleSwap = useCallback(async () => {
    try {
      setSwapping(true)
      if (connectionStatus === 'connected' && explorerProvider !== undefined && swapDetails !== undefined) {
        const result = await swap(
          swapDetails,
          balance,
          signer,
          explorerProvider,
          account.address,
          deadline
        )
        console.log(`swap tx submitted, tx id: ${result.txId}`)
        setTxId(result.txId)
        updateBalanceForTx(result.txId)
        setSwapping(false)
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("User abort")) {
        console.log("Swap aborted by the user")
      }
      else {
        setError(`${error}`)
      }
      setSwapping(false)
      console.error(`failed to swap, error: ${error}`)
    }
  }, [connectionStatus, account, explorerProvider, signer, swapDetails, slippage, deadline, balance, updateBalanceForTx])

  const readyToSwap =
    connectionStatus === 'connected' &&
    !swapping && !completed &&
    error === undefined &&
    swapDetails !== undefined
  const swapButton = (
    <ButtonWithLoader
      disabled={!readyToSwap}
      onClick={handleSwap}
      className={
        classes.gradientButton + (!readyToSwap ? " " + classes.disabled : "")
      }
    >
      Swap
    </ButtonWithLoader>
  );

  const connectButton = (
    <div className={classes.connectWalletButton}>
      <AlephiumConnectButton label="Connect wallet" />
    </div>
  );

  return (
    <Container className={classes.centeredContainer} maxWidth="sm">
      <div className={classes.swapTitle}>
        <Typography variant="h5" color="textSecondary">
          Trade
        </Typography>
        <TransactionSettings />
      </div>
      {/* <div className={classes.titleBar}></div> */}
      {/* <Typography variant="h4" color="textSecondary">
          Swap
          </Typography> */}
      {/* <div className={classes.spacer} /> */}
      <Paper className={classes.mainPaper}>
        <WaitingForTxSubmission
          open={!!swapping && !completed}
          text="Swapping"
        />
        <TransactionSubmitted
          open={!!completed}
          txId={txId!}
          buttonText="Swap More Coins"
          onClick={handleReset}
        />
        <div>
          <Collapse in={!swapping && !completed}>
            {
              <>
                {sourceContent}
                {middleButton}
                {targetContent}
                {error ? (
                  <Typography variant="body2" color="error" className={classes.error}>
                    {error}
                  </Typography>
                ) : null}
                <div className={classes.spacer} />
              </>
            }
            <SwapDetailsCard swapDetails={swapDetails}></SwapDetailsCard>
            {connectionStatus === 'connected' ? swapButton : connectButton}
          </Collapse>
        </div>
      </Paper>
      <div className={classes.spacer} />
    </Container>
  );
}

function formatPriceImpact(impact: number): string {
  if (impact < 0.0001) {
    return '< 0.0001'
  }
  return impact.toFixed(4)
}

function calcPrice(reserveIn: bigint, tokenInDecimals: number, reserveOut: bigint, tokenOutDecimals: number): string {
  const numerator = reserveIn * (10n ** BigInt(tokenOutDecimals))
  const denumerator = reserveOut * (10n ** BigInt(tokenInDecimals))
  const price = BigNumber(numerator.toString()).div(BigNumber(denumerator.toString()))
  const min = BigNumber('0.000001')
  if (price.lt(min)) {
    return `< ${min}`
  }
  return `= ${price.toFixed(6)}`
}

function SwapDetailsCard({ swapDetails } : { swapDetails : SwapDetails | undefined }) {
  if (swapDetails === undefined) {
    return null
  }

  const {
    swapType,
    state,
    tokenInInfo,
    tokenOutInfo,
    tokenOutAmount,
    maximalTokenInAmount,
    minimalTokenOutAmount,
    priceImpact
  } = swapDetails
  const [[reserveIn, tokenInDecimals], [reserveOut, tokenOutDecimals]] = state.token0Info.id === tokenInInfo.id
    ? [[state.reserve0, state.token0Info.decimals], [state.reserve1, state.token1Info.decimals]]
    : [[state.reserve1, state.token1Info.decimals], [state.reserve0, state.token0Info.decimals]]
  return <Card variant='outlined' style={{ width: '100%', padding: '0', borderRadius: '10px' }}>
    <div style={{ display: 'grid', gridAutoRows: 'auto', gridRowGap: '5px', paddingTop: '10px', paddingBottom: '10px' }}>
      <DetailItem
        itemName='Price:'
        itemValue={`1 ${tokenOutInfo.symbol} ${calcPrice(reserveIn, tokenInDecimals, reserveOut, tokenOutDecimals)} ${tokenInInfo.symbol}`}
      />
      <DetailItem
        itemName='Expected Output:'
        itemValue={`${bigIntToString(tokenOutAmount, tokenOutInfo.decimals)} ${tokenOutInfo.symbol}`}
      />
      <DetailItem
        itemName='Price Impact:'
        itemValue={`${formatPriceImpact(priceImpact)} %`}
      />
      <DetailItem
        itemName={swapType === 'ExactIn' ? 'Minimal received after slippage:' : 'Maximum sent after slippage:'}
        itemValue={
          swapType === 'ExactIn'
            ? `${bigIntToString(minimalTokenOutAmount!, tokenOutInfo.decimals)} ${tokenOutInfo.symbol}`
            : `${bigIntToString(maximalTokenInAmount!, tokenInInfo.decimals)} ${tokenInInfo.symbol}`
        }
      />
    </div>
  </Card>
}

export default Swap;
