use anchor_lang::prelude::*;

declare_id!("2zZpWQ35TqpTwKe9fYqp5hLMkEKXeX28Peb4vsbnUZNS");

#[program]
pub mod program_marketplace {
    use super::*;

    pub fn initialize_seller_program(ctx: Context<InitializeSellerProgram>, program_id : Pubkey, amount:u64) -> Result<()> {
        ctx.accounts.seller_program.program_id = program_id;
        ctx.accounts.seller_program.seller = ctx.accounts.seller.key();
        ctx.accounts.seller_program.amount = amount;
        ctx.accounts.seller_program.seller_program_bump = *ctx.bumps.get("seller_program").unwrap();
        Ok(())
    }

    pub fn initialize_access_pda(ctx: Context<InitializeAccessPda>, program_id : Pubkey, trial : bool) -> Result<()> {
        ctx.accounts.access_pda.buyer = ctx.accounts.buyer.key();
        ctx.accounts.access_pda.program_id = program_id;
        ctx.accounts.access_pda.access_pda_bump = *ctx.bumps.get("access_pda").unwrap();
        if trial == true {
            ctx.accounts.access_pda.expires_at = Clock::get()?.unix_timestamp + 604800_i64;
        }
        else { ctx.accounts.access_pda.expires_at = 0; }
        Ok(())
    }

    pub fn close_expired_access(ctx: Context<CloseExpiredAccess>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(program_id:Pubkey)]
pub struct InitializeSellerProgram<'info> {
    #[account(mut)]
    seller:Signer<'info>,
    #[account(
        init,
        payer = seller,
        space = 8 + 32*2 + 8 + 1,
        seeds=[b"seller", seller.key().as_ref(), program_id.as_ref()],
        bump,
    )]
    seller_program: Account<'info, SellerProgram>,
    system_program : Program<'info, System>
}

#[derive(Accounts)]
pub struct InitializeAccessPda<'info> {
    #[account(mut)]
    buyer:Signer<'info>,
    #[account(
        seeds=[b"seller",seller_program.seller.key().as_ref(), seller_program.program_id.key().as_ref()],
        bump = seller_program.seller_program_bump,
    )]
    seller_program: Account<'info, SellerProgram>,
    #[account(
        init,
        payer = buyer,
        space = 8 + 32*2 + 1 + 8,
        seeds = [b"access", buyer.key().as_ref(), seller_program.program_id.key().as_ref()],
        bump

    )]
    access_pda: Account<'info, AccessPda>,
    system_program : Program<'info, System>
}


#[derive(Accounts)]
pub struct CloseExpiredAccess<'info> {
    #[account(mut)]
    closer: Signer<'info>,
    #[account(
        mut,
       constraint = access_pda.expires_at != 0 && access_pda.expires_at < Clock::get()?.unix_timestamp,
       close = closer,
    )]
    access_pda: Account<'info, AccessPda>,
    system_program: Program<'info, System>,
}

#[account]
pub struct AccessPda {
    pub program_id : Pubkey,
    pub buyer:Pubkey,
    pub access_pda_bump:u8,
    pub expires_at : i64,
}

#[account]
pub struct SellerProgram {
    pub program_id:Pubkey,
    pub seller:Pubkey,
    pub amount:u64,
    pub seller_program_bump:u8,
}