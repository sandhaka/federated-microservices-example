using deposits.demo.Infrastructure;
using deposits.demo.Infrastructure.GraphQl;
using GraphQL.Types;

namespace deposits.demo.Application.GraphTypes;

internal class DepositQuery : FederatedQuery
{
    public DepositQuery(IDbContext dbContext)
    {
        Name = "Query";
        Field<NonNullGraphType<ListGraphType<NonNullGraphType<DepositGraphType>>>>(
            "deposits", 
            "Returns a list of deposits",
            resolve: context => dbContext.Deposits.ToList());
        Field<DepositGraphType>(
            "deposit", 
            "Returns a single deposit",
            arguments: new QueryArguments(
                new QueryArgument<IntGraphType> {Name = "id", Description = ""}
            ),
            resolve: context => dbContext.Deposits.Single(x => x.Id == (int?)context.Arguments!["id"].Value));
    }
}