use anchor_lang::prelude::*;

declare_id!("2zZpWQ35TqpTwKe9fYqp5hLMkEKXeX28Peb4vsbnUZNS");

#[program]
pub mod program_marketplace {
    use super::*;

    pub fn initialize_seller_program(ctx: Context<InitializeSellerProgram>, program_id : Pubkey) -> Result<()> {
        ctx.accounts.seller_program.program_id = program_id;
        ctx.accounts.seller_program.seller = ctx.accounts.seller.key();
        Ok(())
    }

    pub fn initialize_access_pda(ctx: Context<InitializeAccessPda>) -> Result<()> {
        ctx.accounts.access_pda.buyer = ctx.accounts.buyer.key();
        ctx.accounts.access_pda.program_id = ctx.accounts.seller_program.program_id;
        unimplemented!()
    }
}

#[derive(Accounts)]
pub struct InitializeSellerProgram<'info> {
    #[account(mut)]
    seller:Signer<'info>,
    #[account(
        init,
        payer = seller,
        space = 8 + 32*2,
        seeds=[b"seller"],
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
        seeds=[b"seller"],
        bump,
    )]
    seller_program: Account<'info, SellerProgram>,
    #[account(
        init,
        payer = buyer,
        space = 8 + 32*2,
        seeds = [b"access"],
        bump

    )]
    access_pda: Account<'info, AccessPda>,
    system_program : Program<'info, System>
}

#[account]
pub struct AccessPda {
    program_id : Pubkey,
    buyer:Pubkey
}

#[account]
pub struct SellerProgram {
    program_id:Pubkey,
    seller:Pubkey,
}