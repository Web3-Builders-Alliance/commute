use anchor_lang::prelude::*;
use program_marketplace::AccessPda;

declare_id!("5ctVKdDrrPhvrpEH2zat86QHeEk2r1ayUJFSu4Gui9k9");

#[program]
pub mod counter_anchor {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, program_id: Pubkey) -> Result<()> {
        let access_pda = &mut ctx.accounts.access_pda.try_borrow_data()?;
        let access_pda_data = AccessPda::try_deserialize(&mut access_pda.as_ref()).expect("Error deserializing access pda");
        // let access_pda =&mut ctx.accounts.access_pda;
        if access_pda_data.buyer == ctx.accounts.user.key() && access_pda_data.program_id == program_id {
            let counter_account = &mut ctx.accounts.counter_account;
            counter_account.count = 0;
        }
        Ok(())
    }

    pub fn increase(ctx: Context<Increase>, increment: u64) -> Result<()> {
        let access_pda = &mut ctx.accounts.access_pda.try_borrow_data()?;
        let access_pda_data = AccessPda::try_deserialize(&mut access_pda.as_ref()).expect("Error deserializing access pda");
        let counter_account = &mut ctx.accounts.counter_account;
        if access_pda_data.expires_at == 0 || Clock::get()?.unix_timestamp < access_pda_data.expires_at {
            let current_count = &counter_account.count;
            counter_account.count = if u64::MAX - current_count >= increment {
                current_count + increment
            } else {
                u64::MAX
            };
        }
        
        Ok(())
    }

    pub fn decrease(ctx: Context<Decrease>, decrement: u64) -> Result<()> {
        let access_pda = &mut ctx.accounts.access_pda.try_borrow_data()?;
        let access_pda_data = AccessPda::try_deserialize(&mut access_pda.as_ref()).expect("Error deserializing access pda");
        let counter_account = &mut ctx.accounts.counter_account;
        if access_pda_data.expires_at == 0 || Clock::get()?.unix_timestamp < access_pda_data.expires_at {
            let current_count = &counter_account.count;
            counter_account.count = if current_count >= &decrement {
                current_count - decrement
        } else {
            0
        };
        }
        
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub counter_account: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    /// CHECK: this account is safe
    pub access_pda: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increase<'info> {
    #[account(mut)]
    pub counter_account: Account<'info, Counter>,
    /// CHECK: this account is safe
    pub access_pda: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct Decrease<'info> {
    #[account(mut)]
    pub counter_account: Account<'info, Counter>,
    /// CHECK: this account is safe
    pub access_pda: AccountInfo<'info>,
}

#[account]
pub struct Counter {
    pub count: u64,
}
