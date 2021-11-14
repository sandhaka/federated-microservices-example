namespace deposits.demo.Infrastructure.Entities;

public record Deposit
{
    public int Id { get; set; }
    public int Number { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; }
}