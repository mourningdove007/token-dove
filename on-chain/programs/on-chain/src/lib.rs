use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_2022::{self, SetAuthority};
use anchor_spl::token_2022::spl_token_2022::instruction::AuthorityType;
use anchor_spl::token_interface::{self, Mint, MintTo, TokenAccount, TokenInterface, FreezeAccount};
declare_id!("DPxJ2kZv6z2gb8gDrFUkftmMQGfAqR3c4XFbCDSY9L9n");

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
pub fn mint_to_player(ctx: Context<MintToPlayer>, amount: u64) -> Result<()> {
    let cpi_accounts = MintTo {
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.player_token_account.to_account_info(),
        authority: ctx.accounts.signer.to_account_info(),
    };

    let cpi_program_id = ctx.accounts.token_program.to_account_info();
    let cpi_context = CpiContext::new(cpi_program_id, cpi_accounts);

    token_interface::mint_to(cpi_context, amount)?;

    Ok(())
}

pub fn freeze_player_account(ctx: Context<FreezePlayerAccount>) -> Result<()> {
    let cpi_accounts = FreezeAccount {
        account: ctx.accounts.player_token_account.to_account_info(),
        mint: ctx.accounts.mint.to_account_info(),
        authority: ctx.accounts.signer.to_account_info(),
    };

    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

    token_interface::freeze_account(cpi_ctx)?;

    msg!("Frozen token account: {}", ctx.accounts.player_token_account.key());

    Ok(())
}

pub fn renounce_authorities(ctx: Context<RenounceAuthorities>) -> Result<()> {
    let cpi_program = ctx.accounts.token_program.to_account_info();

    // remove mint authority
    let cpi_accounts = SetAuthority {
        account_or_mint: ctx.accounts.mint.to_account_info(),
        current_authority: ctx.accounts.signer.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(cpi_program.clone(), cpi_accounts);

    token_2022::set_authority(
        cpi_ctx,
        AuthorityType::MintTokens,
        None,
    )?;

    // remove freeze authority
    let cpi_accounts = SetAuthority {
        account_or_mint: ctx.accounts.mint.to_account_info(),
        current_authority: ctx.accounts.signer.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

    token_2022::set_authority(
        cpi_ctx,
        AuthorityType::FreezeAccount,
        None,
    )?;

    msg!("Renounced mint + freeze authorities.");

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
        mint::decimals = 0,
        mint::authority = signer.key(),
        mint::freeze_authority = signer.key()
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

#[derive(Accounts)]
pub struct MintToPlayer<'info> {
    #[account(mut)]
    pub signer: Signer<'info>, // admin

    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,

    /// CHECK: player does not need to sign
    pub player: UncheckedAccount<'info>,

    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = player,
        associated_token::token_program = token_program,
    )]
    pub player_token_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct FreezePlayerAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>, // admin freeze authority

    pub mint: InterfaceAccount<'info, Mint>,

    #[account(mut)]
    pub player_token_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Interface<'info, TokenInterface>,
}

#[derive(Accounts)]
pub struct RenounceAuthorities<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,

    pub token_program: Program<'info, anchor_spl::token_2022::Token2022>,
}



