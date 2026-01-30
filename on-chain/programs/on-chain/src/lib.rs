use anchor_lang::prelude::*;

declare_id!("ExB5P3grwDuyMw4KmgDTuRA3TQC9bSB1jsXQYEX7DJdg");

#[account]
pub struct UserNft {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub metadata_uri: String,
    pub created_at: i64,
}

#[derive(Accounts)]
pub struct MintUserNft<'info> {
    /// User minting the NFT
    #[account(mut)]
    pub user: Signer<'info>,

    /// Mint account for the NFT (created client-side for now)
    /// CHECK: Mint validation will be added later
    pub mint: UncheckedAccount<'info>,

    /// PDA storing NFT ownership data
    #[account(
        init,
        payer = user,
        space = UserNft::LEN,
        seeds = [b"user_nft", mint.key().as_ref()],
        bump
    )]
    pub user_nft: Account<'info, UserNft>,

    /// Required for account creation
    pub system_program: Program<'info, System>,
}

impl UserNft {
    pub const MAX_METADATA_URI_LEN: usize = 200;

    pub const LEN: usize = 8 + // discriminator
        32 + // owner
        32 + // mint
        4 + Self::MAX_METADATA_URI_LEN + // metadata_uri (String)
        8; // created_at
}

#[program]
pub mod on_chain {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn mint_user_nft(ctx: Context<MintUserNft>, metadata_uri: String) -> Result<()> {
        let user_nft = &mut ctx.accounts.user_nft;

        user_nft.owner = ctx.accounts.user.key();
        user_nft.mint = ctx.accounts.mint.key();
        user_nft.metadata_uri = metadata_uri;
        user_nft.created_at = Clock::get()?.unix_timestamp;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
