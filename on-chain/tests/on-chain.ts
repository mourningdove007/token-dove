import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { HelloAnchor } from "../target/types/hello_anchor";
import {
  TOKEN_2022_PROGRAM_ID,
  getMint,
  getAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

describe("hello_anchor", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.HelloAnchor as Program<HelloAnchor>;
  const [mint, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("mint")],
    program.programId,
  );

  const [token, tokenBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("token")],
    program.programId,
  );

  it("Is initialized!", async () => {

    const tx = await program.methods.testInstruction().rpc();
    console.log("Your transaction signature", tx);
  });

  it("can create mint account", async () => {
    const tx = await program.methods
      .createMint()
      .accounts({
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed" });
    console.log("Your transaction signature", tx);

    const mintAccount = await getMint(
      program.provider.connection,
      mint,
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );

    console.log("Mint Account", mintAccount);
  })


  it("can create token account", async () => {
    const tx = await program.methods
      .createTokenAccount()
      .accounts({
        mint: mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed" });

    console.log("Your transaction signature", tx);

    const tokenAccount = await getAccount(
      program.provider.connection,
      token,
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );

    console.log("Token Account", tokenAccount);
  });

  it("Mint Tokens", async () => {
    const tx = await program.methods
      .mintTokens(new anchor.BN(100))
      .accounts({
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed" });

    console.log("Your transaction signature", tx);

    const associatedTokenAccount = await getAssociatedTokenAddress(
      mint,
      program.provider.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID,
    );

    const tokenAccount = await getAccount(
      program.provider.connection,
      associatedTokenAccount,
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );

    console.log("Token Account", tokenAccount);
  });

});