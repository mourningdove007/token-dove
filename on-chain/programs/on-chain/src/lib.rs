use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{self, Mint, MintTo, TokenAccount, TokenInterface};
declare_id!("DPxJ2kZv6z2gb8gDrFUkftmMQGfAqR3c4XFbC9SY9L9n");

#[program]
mod token_dove {
    use super::*;
    pub fn test_instruction(ctx: Context<InstructionAccounts>) -> Result<()> {
        msg!("PDA: {}", ctx.accounts.signer.key());
        Ok(())
    }

    pub fn create_mint(ctx: Context<CreateMint>) -> Result<()> {
        msg!("Created Mint Account: {:?}", ctx.accounts.mint.key());
        Ok(())
    }

    pub fn create_token_account(ctx: Context<CreateTokenAccount>) -> Result<()> {
        msg!(
            "Created Token Account: {:?}",
            ctx.accounts.token_account.key()
        );
        Ok(())
    }

    pub fn mint_tokens(ctx: Context<MintTokens>, amount: u64) -> Result<()> {
    // Create the MintTo struct with the accounts required for the CPI
    let cpi_accounts = MintTo {
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.token_account.to_account_info(),
        authority: ctx.accounts.signer.to_account_info(),
    };
 
    // The program being invoked in the CPI
    let cpi_program_id = ctx.accounts.token_program.to_account_info();
 
    // Combine the accounts and program into a "CpiContext"
    let cpi_context = CpiContext::new(cpi_program_id, cpi_accounts);
 
    // Make CPI to mint_to instruction on the token program
    token_interface::mint_to(cpi_context, amount)?;
    Ok(())
}
}
#[derive(Accounts)]
pub struct CreateMint<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer,
        mint::decimals = 6,
        mint::authority = signer,
        mint::freeze_authority = mint.key()
    )]
    pub mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CreateTokenAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = signer,
        associated_token::token_program = token_program,
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,
    pub mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintTokens<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(mut)]
    pub token_account: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
}

#[derive(Accounts)]
pub struct InstructionAccounts<'info> {
    pub signer: Signer<'info>,
}
