using GraphQL.Types;

namespace deposits.demo.Infrastructure.GraphQl
{
    public class EntityType : UnionGraphType
    {
        public EntityType(IEnumerable<Type> types)
        {
            Name = "_Entity";

            foreach (var type in types)
            {
                Type(type);
            }
        }
    }
}
