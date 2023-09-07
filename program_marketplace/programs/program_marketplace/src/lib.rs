use anchor_lang::prelude::*;

declare_id!("2zZpWQ35TqpTwKe9fYqp5hLMkEKXeX28Peb4vsbnUZNS");

#[program]
pub mod program_marketplace {
    use super::*;

    pub fn initialize_seller_program(ctx: Context<InitializeSellerProgram>, program_id : Pubkey, amount:u64) -> Result<()> {
        ctx.accounts.seller_program.program_id = program_id;
        ctx.accounts.seller_program.seller = ctx.accounts.seller.key();
        ctx.accounts.seller_program.amount = amount;
        ctx.accounts.seller_program.bump = *ctx.bumps.get("seller").unwrap();
        Ok(())
    }

    pub fn initialize_access_pda(ctx: Context<InitializeAccessPda>, program_id : Pubkey) -> Result<()> {
        ctx.accounts.access_pda.buyer = ctx.accounts.buyer.key();
        ctx.accounts.access_pda.program_id = program_id;
        ctx.accounts.access_pda.bump = *ctx.bumps.get("access").unwrap();
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
        bump = seller_program.bump,
    )]
    seller_program: Account<'info, SellerProgram>,
    #[account(
        init,
        payer = buyer,
        space = 8 + 32*2 + 1,
        seeds = [b"access", buyer.key().as_ref(), seller_program.program_id.key().as_ref()],
        bump

    )]
    access_pda: Account<'info, AccessPda>,
    system_program : Program<'info, System>
}

#[account]
pub struct AccessPda {
    program_id : Pubkey,
    buyer:Pubkey,
    bump:u8,
}

#[account]
pub struct SellerProgram {
    program_id:Pubkey,
    seller:Pubkey,
    amount:u64,
    bump:u8,
}