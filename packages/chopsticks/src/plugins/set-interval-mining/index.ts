import { Handler } from '../../rpc/shared'
import { defaultLogger } from '../../logger'

export const rpc: Handler = async (context, [blockTime]) => {
  
  const timer = context.chain.initMiningTimer(blockTime)

  timer.start()
  
  defaultLogger.info({ blockTime }, 'dev_setIntervalMining')
  
  return 1
}
