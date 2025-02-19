namespace AppCore.Entities;

public class User(int id, string email, string password)
{
    public int Id { get; private set; } = id;
    public string Email { get; private set; } = email;
    public string Password { get; private set; } = password;
}
