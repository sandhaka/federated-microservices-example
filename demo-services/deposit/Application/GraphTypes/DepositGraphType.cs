using deposits.demo.Infrastructure;
using deposits.demo.Infrastructure.Entities;
using deposits.demo.Infrastructure.GraphQl;
using GraphQL.DataLoader;

namespace deposits.demo.Application.GraphTypes;

internal sealed class DepositGraphType : FederatedObjectGraphType<Deposit>
{
    public DepositGraphType(IDbContext dbContext, IDataLoaderContextAccessor accessor)
    {
        Name = "Deposit";
        
        Key("id");

        Field(x => x.Id).Description("Deposit id");
        Field(x => x.Amount).Description("Deposit amount");
        Field(x => x.Number).Description("Deposit number");
        Field(x => x.Currency).Description("Deposit currency");
        
        ResolveReference(ctx => accessor.Context.GetOrAddBatchLoader<int, Deposit?>(
            GetResolveReferenceLoaderKey(), fetchFunc: (items) =>
            {
                return Task.FromResult<IDictionary<int, Deposit?>>(items.ToDictionary(
                    id => id, 
                    id => dbContext.Deposits.SingleOrDefault(d => d.Id == id))
                );
            }
        ).LoadAsync((int)(ctx.Arguments["id"] ?? throw new ArgumentException(nameof(ctx.Arguments))))!);
    }
}