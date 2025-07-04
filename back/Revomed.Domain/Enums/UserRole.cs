using System.Text.Json.Serialization;

namespace Domain.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum UserRole : ushort
{
    // manually set the values to stay in sync with db
    Patient = 0,
    Medic = 1,
    Admin = 2,
}
