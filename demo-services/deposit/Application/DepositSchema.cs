using deposits.demo.Application.GraphTypes;
using deposits.demo.Infrastructure.GraphQl;

namespace deposits.demo.Application;

internal class DepositSchema : FederatedSchema
{
    public DepositSchema(IServiceProvider provider, DepositQuery depositQuery) : base(provider)
    {
        Query = depositQuery;
    }
}