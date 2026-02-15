import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { TokenDove } from "../target/types/token_dove";
import {
  TOKEN_2022_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
} from "@solana/spl-token";
import { expect } from "chai";

describe("SPL", () => {
  describe("Mint Account", () => {
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.TokenDove as Program<TokenDove>;
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

      expect(mintAccount.decimals).to.equal(0);

      expect(mintAccount.freezeAuthority?.toBase58()).to.equal(
        program.provider.publicKey.toBase58()
      );
    });

  });


  describe("Token Account", () => {
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.TokenDove as Program<TokenDove>;
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

    const program = anchor.workspace.TokenDove as Program<TokenDove>;
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

  describe("Distribute Tokens", () => {
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.TokenDove as Program<TokenDove>;
    const mint = anchor.web3.Keypair.generate();

    it("mints tokens to multiple players", async () => {
      // 1) Create mint
      await program.methods
        .createMint()
        .accounts({
          mint: mint.publicKey,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([mint])
        .rpc({ commitment: "confirmed" });

      // 2) Create some players
      const players = [
        anchor.web3.Keypair.generate(),
        anchor.web3.Keypair.generate(),
        anchor.web3.Keypair.generate(),
      ];

      // 3) Mint 1 token to each player
      for (const player of players) {
        const playerAta = await getAssociatedTokenAddress(
          mint.publicKey,
          player.publicKey,
          false,
          TOKEN_2022_PROGRAM_ID
        );

        await program.methods
          .mintToPlayer(new anchor.BN(1))
          .accounts({
            signer: program.provider.publicKey,
            mint: mint.publicKey,
            player: player.publicKey,
            playerTokenAccount: playerAta,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
          })
          .rpc({ commitment: "confirmed" });

        // 4) Fetch ATA and confirm balance
        const tokenAccount = await getAccount(
          program.provider.connection,
          playerAta,
          "confirmed",
          TOKEN_2022_PROGRAM_ID
        );

        console.log(
          `Player ${player.publicKey.toBase58()} token balance:`,
          tokenAccount.amount.toString()
        );

        expect(tokenAccount.amount.toString()).to.equal("1");
      }
    });
  });

  describe("Freeze Player Accounts", () => {

    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.TokenDove as Program<TokenDove>;
    const mint = anchor.web3.Keypair.generate();

    it("mints tokens then freezes the player's token account", async () => {
      // create mint
      await program.methods
        .createMint()
        .accounts({
          mint: mint.publicKey,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([mint])
        .rpc({ commitment: "confirmed" });

      const player = anchor.web3.Keypair.generate();

      const playerAta = await getAssociatedTokenAddress(
        mint.publicKey,
        player.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      // mint 1 token to player
      await program.methods
        .mintToPlayer(new anchor.BN(1))
        .accounts({
          signer: program.provider.publicKey,
          mint: mint.publicKey,
          player: player.publicKey,
          playerTokenAccount: playerAta,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .rpc({ commitment: "confirmed" });

      // freeze player's ATA
      await program.methods
        .freezePlayerAccount()
        .accounts({
          signer: program.provider.publicKey,
          mint: mint.publicKey,
          playerTokenAccount: playerAta,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .rpc({ commitment: "confirmed" });

      // fetch token account + verify frozen state
      const tokenAccount = await getAccount(
        program.provider.connection,
        playerAta,
        "confirmed",
        TOKEN_2022_PROGRAM_ID
      );

      console.log("Frozen state:", tokenAccount.isFrozen);

      expect(tokenAccount.isFrozen).to.equal(true);
    });
  });

  describe("Renounce Authorities", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.TokenDove as Program<TokenDove>;
    const mint = anchor.web3.Keypair.generate();

  it("removes mint authority + freeze authority", async () => {
    // create mint
    await program.methods
      .createMint()
      .accounts({
        mint: mint.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([mint])
      .rpc({ commitment: "confirmed" });

    // renounce both authorities
    await program.methods
      .renounceAuthorities()
      .accounts({
        signer: program.provider.publicKey,
        mint: mint.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed" });

    // fetch mint + verify
    const mintAccount = await getMint(
      program.provider.connection,
      mint.publicKey,
      "confirmed",
      TOKEN_2022_PROGRAM_ID
    );

    console.log("Mint Authority:", mintAccount.mintAuthority);
    console.log("Freeze Authority:", mintAccount.freezeAuthority);

    expect(mintAccount.mintAuthority).to.equal(null);
    expect(mintAccount.freezeAuthority).to.equal(null);
  });
});




});