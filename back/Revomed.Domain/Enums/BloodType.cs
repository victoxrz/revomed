using System.Text.Json.Serialization;

namespace Domain.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum BloodType : ushort // blood type
{
    [JsonStringEnumMemberName("A+")]
    Apl,
    [JsonStringEnumMemberName("A-")]
    Amin,
    [JsonStringEnumMemberName("B+")]
    Bpl,
    [JsonStringEnumMemberName("B-")]
    Bmin,
    [JsonStringEnumMemberName("AB+")]
    ABpl,
    [JsonStringEnumMemberName("AB-")]
    ABmin,
    [JsonStringEnumMemberName("O+")]
    Opl,
    [JsonStringEnumMemberName("O-")]
    Omin
}
