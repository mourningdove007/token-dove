import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { HelloAnchor } from "../target/types/hello_anchor";
import {
  TOKEN_2022_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
} from "@solana/spl-token";

describe("SPL", () => {
  describe("Mint Account", () => {
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.HelloAnchor as Program<HelloAnchor>;
    const mint = anchor.web3.Keypair.generate();

    it("can create mint account", async () => {
      await program.methods
        .createMint()
        .accounts({
          mint: mint.publicKey,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([mint])
        .rpc({ commitment: "confirmed" });

      const mintAccount = await getMint(
        program.provider.connection,
        mint.publicKey,
        "confirmed",
        TOKEN_2022_PROGRAM_ID,
      );

      console.log("Mint Account", mintAccount);

    })
  });


  describe("Token Account", () => {
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.HelloAnchor as Program<HelloAnchor>;
    const mint = anchor.web3.Keypair.generate();


    it("Create token account", async () => {

      await program.methods
        .createMint()
        .accounts({
          mint: mint.publicKey,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([mint])
        .rpc({ commitment: "confirmed" });
      await getMint(
        program.provider.connection,
        mint.publicKey,
        "confirmed",
        TOKEN_2022_PROGRAM_ID,
      );

      await program.methods
        .createTokenAccount()
        .accounts({
          signer: program.provider.publicKey,
          mint: mint.publicKey,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .rpc({ commitment: "confirmed" });


      const associatedTokenAccount = await getAssociatedTokenAddress(
        mint.publicKey,
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

  describe("Mint Tokens", () => {
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.HelloAnchor as Program<HelloAnchor>;
    const mint = anchor.web3.Keypair.generate();

    it("Mint Tokens", async () => {
      await program.methods
        .createMint()
        .accounts({
          mint: mint.publicKey,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([mint])
        .rpc({ commitment: "confirmed" });
      await getMint(
        program.provider.connection,
        mint.publicKey,
        "confirmed",
        TOKEN_2022_PROGRAM_ID,
      );

      await program.methods
        .createTokenAccount()
        .accounts({
          signer: program.provider.publicKey,
          mint: mint.publicKey,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .rpc({ commitment: "confirmed" });


      const associatedTokenAccount = await getAssociatedTokenAddress(
        mint.publicKey,
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

      const tx = await program.methods
        .mintTokens(new anchor.BN(100))
        .accounts({
          mint: mint.publicKey,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          tokenAccount: tokenAccount.address
        })
        .rpc({ commitment: "confirmed" });

      console.log("Your transaction signature", tx);
    });
  });

});