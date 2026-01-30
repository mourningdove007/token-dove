use anchor_lang::prelude::*;

declare_id!("ExB5P3grwDuyMw4KmgDTuRA3TQC9bSB1jsXQYEX7DJdg");

#[program]
pub mod on_chain {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
