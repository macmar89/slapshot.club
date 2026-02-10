import { TaskHandler } from 'payload'
import { evaluateMatch, revertMatchEvaluation } from '@/features/matches/utils/evaluation'

interface EvaluateMatchInput {
  matchId: string
  action: 'evaluate' | 'revert'
}

export const evaluateMatchTask: TaskHandler<any> = async ({
  input,
  req: { payload },
}) => {
  const { matchId, action } = input as EvaluateMatchInput

  if (!matchId) {
    payload.logger.error('[TASK] evaluateMatchTask missing matchId')
    return {
      output: { error: 'Missing matchId' },
    }
  }

  payload.logger.info(`[TASK] Starting match evaluation task: ${action} for ${matchId}`)

  try {
    if (action === 'revert') {
      await revertMatchEvaluation(matchId, payload)
    } else {
      await evaluateMatch(matchId, payload)
    }

    return {
      output: {
        message: `Match ${matchId} ${action}d successfully`,
      },
    }
  } catch (error: any) {
    payload.logger.error(`[TASK ERROR] evaluateMatchTask failed: ${error.message}`)
    throw error
  }
}
