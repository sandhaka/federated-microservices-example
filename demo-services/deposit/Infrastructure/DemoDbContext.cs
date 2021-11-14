using deposits.demo.Infrastructure.Entities;
using Newtonsoft.Json;

namespace deposits.demo.Infrastructure;

internal class DemoDbContext : IDbContext
{
    public HashSet<Deposit> Deposits => new HashSet<Deposit>(Load());

    private IEnumerable<Deposit> Load()
    {
        var json = File.ReadAllText("sampleDb.json");
        return JsonConvert.DeserializeObject<List<Deposit>>(json) ?? Enumerable.Empty<Deposit>();
    }
}

public interface IDbContext
{
    HashSet<Deposit> Deposits { get; }
}