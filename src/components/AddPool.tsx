import { Container, Paper, Typography, Box, IconButton } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import Collapse from "@material-ui/core/Collapse";
import { TokenInfo } from "@alephium/token-list"
import { useCallback, useEffect, useMemo, useState } from "react";
import ButtonWithLoader from "./ButtonWithLoader";
import { tokenPairExist, createTokenPair } from "../utils/dex";
import { useAvailableBalances } from "../hooks/useAvailableBalance";
import { commonStyles } from "./style";
import TokenSelectDialog from "./TokenSelectDialog";
import { useHistory } from "react-router-dom";
import { TransactionSubmitted, WaitingForTxSubmission } from "./Transactions";
import { AlephiumConnectButton, useWallet } from "@alephium/web3-react";

function AddPool({ goBack }) {
  const commonClasses = commonStyles();
  const [tokenAInfo, setTokenAInfo] = useState<TokenInfo | undefined>(undefined)
  const [tokenBInfo, setTokenBInfo] = useState<TokenInfo | undefined>(undefined)
  const [txId, setTxId] = useState<string | undefined>(undefined)
  const [addingPool, setAddingPool] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const { account, signer, connectionStatus, nodeProvider, explorerProvider } = useWallet()
  const { balance, updateBalanceForTx } = useAvailableBalances()
  const history = useHistory()

  useEffect(() => {
    async function checkContractExist() {
      if (tokenAInfo !== undefined && tokenBInfo !== undefined && connectionStatus === 'connected' && nodeProvider !== undefined) {
        try {
          const exist = await tokenPairExist(nodeProvider, tokenAInfo.id, tokenBInfo.id)
          if (exist) setError(`token pair already exist`)
        } catch (err) {
          setError(`${err}`)
        }
      }
    }

    setError(undefined)
    checkContractExist()
  }, [tokenAInfo, tokenBInfo, nodeProvider, connectionStatus])

  const handleTokenAChange = useCallback((tokenInfo) => {
    setTokenAInfo(tokenInfo)
  }, [])

  const handleTokenBChange = useCallback((tokenInfo) => {
    setTokenBInfo(tokenInfo)
  }, [])

  const completed = useMemo(() => txId !== undefined, [txId])

  const redirectToAddLiquidity = useCallback(() => {
    setTokenAInfo(undefined)
    setTokenBInfo(undefined)
    setTxId(undefined)
    setAddingPool(false)
    setError(undefined)
    history.push('/add-liquidity')
  }, [history])

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

  const handleAddPool = useCallback(async () => {
    try {
      setAddingPool(true)
      if (connectionStatus === 'connected' && explorerProvider !== undefined && tokenAInfo !== undefined && tokenBInfo !== undefined) {
        const result = await createTokenPair(
          signer,
          explorerProvider,
          account.address,
          tokenAInfo.id,
          tokenBInfo.id
        )
        console.log(`add pool succeed, tx id: ${result.txId}, token pair id: ${result.tokenPairId}`)
        setTxId(result.txId)
        updateBalanceForTx(result.txId)
        setAddingPool(false)
      }
    } catch (error) {
      setError(`${error}`)
      setAddingPool(false)
      console.error(`failed to add pool, error: ${error}`)
    }
  }, [signer, account, connectionStatus, explorerProvider, tokenAInfo, tokenBInfo, updateBalanceForTx])

  const readyToAddPool =
    connectionStatus === 'connected' &&
    tokenAInfo !== undefined &&
    tokenBInfo !== undefined &&
    !addingPool && !completed && 
    error === undefined
  const addPoolButton = (
    <ButtonWithLoader
      disabled={!readyToAddPool}
      onClick={handleAddPool}
      className={
        commonClasses.gradientButton + (!readyToAddPool ? " " + commonClasses.disabled : "")
      }
    >
      Add Pool
    </ButtonWithLoader>
  );

 const connectButton = (
    <div className={commonClasses.connectWalletButton}>
      <AlephiumConnectButton label="Connect wallet" />
    </div>
  );

  return (
    <Container className={commonClasses.centeredContainer} maxWidth="sm">
      <Box display="flex" justifyContent="center" alignItems="center" width="100%" position="relative">
        <IconButton onClick={goBack} className={commonClasses.backButton}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" color="textSecondary" className={commonClasses.centerTitle}>
          Add Pool
        </Typography>
        <div></div>
      </Box>
      <div className={commonClasses.spacer} />
      <Paper className={commonClasses.mainPaper}>
        <WaitingForTxSubmission
          open={!!addingPool && !completed}
          text="Adding Pool"
        />
        <TransactionSubmitted
          open={!!completed}
          txId={txId!}
          buttonText="Add Liquidity"
          onClick={redirectToAddLiquidity}
        />
        <div>
          <Collapse in={!addingPool && !completed}>
            {
              <>
                {tokenPairContent}
                <div className={commonClasses.spacer} />
                {error ? (
                  <Typography variant="body2" color="error" className={commonClasses.error}>
                    {error}
                  </Typography>
                ) : null}
                <div className={commonClasses.spacer} />
              </>
            }
            {connectionStatus === 'connected' ? addPoolButton : connectButton}
          </Collapse>
        </div>
      </Paper>
      <div className={commonClasses.spacer} />
    </Container>
  );
}

export default AddPool;
