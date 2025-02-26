namespace AppCore.Contracts
{
    public record PacientRequest
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public bool Sex { get; set; }
        public string IDNP { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string StreetAdress { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
    }
}
