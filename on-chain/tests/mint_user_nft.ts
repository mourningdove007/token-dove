import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { assert } from "chai";

describe("mint_user_nft", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.on_chain as Program<any>;

    it("creates a UserNft account for the user", async () => {

        const mintKeypair = Keypair.generate();

        const [userNftPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("user_nft"),
                mintKeypair.publicKey.toBuffer(),
            ],
            program.programId
        );

        const metadataUri = "https://example.com/metadata.json";

        await program.methods
            .mintUserNft(metadataUri)
            .accounts({
                user: provider.wallet.publicKey,
                mint: mintKeypair.publicKey,
                userNft: userNftPda,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();

        const userNftAccount = await program.account.userNft.fetch(userNftPda);

        assert.equal(
            userNftAccount.owner.toBase58(),
            provider.wallet.publicKey.toBase58(),
            "Owner should match wallet"
        );

        assert.equal(
            userNftAccount.mint.toBase58(),
            mintKeypair.publicKey.toBase58(),
            "Mint should match provided mint"
        );

        assert.equal(
            userNftAccount.metadataUri,
            metadataUri,
            "Metadata URI should match"
        );

        assert.isNumber(
            userNftAccount.createdAt.toNumber(),
            "created_at should be set"
        );
    });

    it("allows the same user to mint multiple NFTs", async () => {
        const provider = anchor.AnchorProvider.env();
        anchor.setProvider(provider);

        const program = anchor.workspace.OnChain as Program<any>;

        const mint1 = Keypair.generate();
        const mint2 = Keypair.generate();

        const metadataUri1 = "https://example.com/metadata1.json";
        const metadataUri2 = "https://example.com/metadata2.json";

        const [userNftPda1] = PublicKey.findProgramAddressSync(
            [Buffer.from("user_nft"), mint1.publicKey.toBuffer()],
            program.programId
        );

        const [userNftPda2] = PublicKey.findProgramAddressSync(
            [Buffer.from("user_nft"), mint2.publicKey.toBuffer()],
            program.programId
        );

        await program.methods
            .mintUserNft(metadataUri1)
            .accounts({
                user: provider.wallet.publicKey,
                mint: mint1.publicKey,
                userNft: userNftPda1,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();

        await program.methods
            .mintUserNft(metadataUri2)
            .accounts({
                user: provider.wallet.publicKey,
                mint: mint2.publicKey,
                userNft: userNftPda2,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();

        const userNft1 = await program.account.userNft.fetch(userNftPda1);
        const userNft2 = await program.account.userNft.fetch(userNftPda2);

        assert.equal(userNft1.owner.toBase58(), provider.wallet.publicKey.toBase58());
        assert.equal(userNft1.mint.toBase58(), mint1.publicKey.toBase58());
        assert.equal(userNft1.metadataUri, metadataUri1);
        assert.isNumber(userNft1.createdAt.toNumber());

        assert.equal(userNft2.owner.toBase58(), provider.wallet.publicKey.toBase58());
        assert.equal(userNft2.mint.toBase58(), mint2.publicKey.toBase58());
        assert.equal(userNft2.metadataUri, metadataUri2);
        assert.isNumber(userNft2.createdAt.toNumber());
    });
});