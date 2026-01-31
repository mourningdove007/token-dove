import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { HelloAnchor } from "../target/types/hello_anchor";
import { TOKEN_2022_PROGRAM_ID, getMint } from "@solana/spl-token";

describe("hello_anchor", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.HelloAnchor as Program<HelloAnchor>;
  const [mint, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("mint")],
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
});