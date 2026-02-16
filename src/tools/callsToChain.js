import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { BROWSERSDK } from "./universal";

// SPL Token program ID
const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

// Your deployed Anchor program ID
const PROGRAM_ID = new PublicKey("DPxJ2kZv6z2gb8gDrFUkftmMQGfAqR3c4XFbCDSY9L9n");

// Browser-friendly Anchor discriminator (8-byte SHA256)
async function getInstructionDiscriminator(name) {
  const encoder = new TextEncoder();
  const data = encoder.encode(name);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = new Uint8Array(hashBuffer);
  return hashArray.slice(0, 8); // first 8 bytes
}

export async function createMintButtonHandler() {
  // 1️⃣ Connect Phantom
  await BROWSERSDK.connect({ provider: "google" });
  const userPubkey = new PublicKey(await BROWSERSDK.solana.getPublicKey());

  // 2️⃣ Generate mint keypair
  const mintKeypair = Keypair.generate();

  // 3️⃣ Connect to network
  const connection = new Connection("http://127.0.0.1:8899", "confirmed");

  // 4️⃣ Calculate rent-exempt lamports for mint
  // SPL Token mint size is 82 bytes
  const lamports = await connection.getMinimumBalanceForRentExemption(82);

  // 5️⃣ Create SystemProgram instruction to fund the mint account
  const createMintAccountIx = SystemProgram.createAccount({
    fromPubkey: userPubkey,
    newAccountPubkey: mintKeypair.publicKey,
    lamports,
    space: 82, // SPL Token mint size
    programId: TOKEN_PROGRAM_ID, // SPL Token program
  });

  // 6️⃣ Create the Anchor instruction (no args, only discriminator)
  const ixDiscriminator = await getInstructionDiscriminator("create_mint");

  const anchorInstruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: userPubkey, isSigner: true, isWritable: true }, // payer/admin
      { pubkey: mintKeypair.publicKey, isSigner: true, isWritable: true }, // mint
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data: ixDiscriminator,
  });

  // 7️⃣ Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash();

  // 8️⃣ Build versioned transaction
  const messageV0 = new TransactionMessage({
    payerKey: userPubkey,
    recentBlockhash: blockhash,
    instructions: [createMintAccountIx, anchorInstruction],
  }).compileToV0Message();

  const tx = new VersionedTransaction(messageV0);

  // 9️⃣ Sign mint keypair
  tx.sign([mintKeypair]);

  // 10️⃣ Phantom signs and sends
  const result = await BROWSERSDK.solana.signAndSendTransaction(tx);

  console.log("Transaction signature:", result.hash);
  console.log("Mint pubkey:", mintKeypair.publicKey.toBase58());
  console.log("Mint secret key (SAVE THIS!):", Array.from(mintKeypair.secretKey));

  return {
    signature: result.hash,
    mintPubkey: mintKeypair.publicKey.toBase58(),
    mintSecretKey: Array.from(mintKeypair.secretKey),
  };
}
