import { beforeEach, describe, expect, it } from 'vitest'
import { delay } from './helper'

import networks from './networks'

describe("Interval mining provider", async () => {

    const blockTime = 12_000;

    const acala = await networks.acala()
    const { chain, dev } = acala

    const getBlockNumber = async () => {
        let block = await chain.getBlock()
        return block?.number || 0
    };

    beforeEach(async () => {
        await dev.setIntervalMining(blockTime)
        console.log('chain.miningTimer _state:', chain.miningTimer)

        await delay(blockTime * 8)
    })

    it("Start Mining Timer Automatically", async function () {

        console.log('chain.miningTimer _state:', chain.miningTimer)

        let blocks: number[] = []
        let upcomingBlocks: number[] = []

        for (let i = 0; i < 6; i++) {
            await delay(blockTime)

            const promises: Promise<any>[] = []

            promises.push(getBlockNumber())
            promises.push(chain.upcomingBlocks())
            let [_block, _pendingBlock] = await Promise.all(promises)

            blocks.push(_block)
            upcomingBlocks.push(_pendingBlock)


        }
        console.log('blocks:', blocks);
        console.log('upcomingBlocks:', upcomingBlocks);

        expect(blocks).toEqual([3000008, 3000009, 3000010, 3000011, 3000012, 3000013])


    });
});
