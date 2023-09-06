use anchor_lang::prelude::*;
mod marketplace;
use crate::marketplace::AccessPda;

declare_id!("GGfsrCPHdtCM1JT9YDrn463SiR6orGvyGtk6P63goCpr");

#[program]
pub mod counter_anchor {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, program_id: Pubkey) -> Result<()> {
        let access_pda =&mut ctx.accounts.access_pda;
        if access_pda.buyer == ctx.accounts.user.key() && access_pda.program_id == program_id {
            let counter_account = &mut ctx.accounts.counter_account;
            counter_account.count = 0;
        }
        Ok(())

    }

    pub fn increase(ctx: Context<Increase>, increment: u64) -> Result<()> {
        let counter_account = &mut ctx.accounts.counter_account;
        let current_count = &counter_account.count;
        counter_account.count = if u64::MAX - current_count >= increment {
            current_count + increment
        } else {
            u64::MAX
        };
        Ok(())
    }

    pub fn decrease(ctx: Context<Decrease>, decrement: u64) -> Result<()> {
        let counter_account = &mut ctx.accounts.counter_account;
        let current_count = &counter_account.count;
        counter_account.count = if current_count >= &decrement {
            current_count - decrement
        } else {
            0
        };
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub counter_account: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub access_pda: Account<'info, AccessPda>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increase<'info> {
    #[account(mut)]
    pub counter_account: Account<'info, Counter>,
}

#[derive(Accounts)]
pub struct Decrease<'info> {
    #[account(mut)]
    pub counter_account: Account<'info, Counter>,
}

#[account]
pub struct Counter {
    pub count: u64,
}
