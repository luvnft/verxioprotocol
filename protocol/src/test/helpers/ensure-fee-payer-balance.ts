import { PublicKey, sol, Umi } from '@metaplex-foundation/umi'

export async function ensureFeePayerBalance(umi: Umi, { account, amount }: { account: PublicKey; amount: number }) {
  const balance = await getFeePayerBalance(umi, { account })
  console.log('balance', balance)

  if (balance >= amount) {
    return
  }

  console.log(` -> ensureFeePayerBalance: ${account.toString()} => ${amount} SOL`)
  await airdropFeePayerBalance(umi, { account, amount: amount * 2 })
}

async function getFeePayerBalance(umi: Umi, { account }: { account: PublicKey }) {
  return await umi.rpc.getBalance(account).then(({ basisPoints }) => Number(basisPoints) / 10 ** 9)
}

async function airdropFeePayerBalance(umi: Umi, { account, amount }: { account: PublicKey; amount: number }) {
  return await umi.rpc.airdrop(account, sol(amount))
}
