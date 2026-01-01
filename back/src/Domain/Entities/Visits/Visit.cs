using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Domain.Entities.Users;

namespace Domain.Entities.Visits;

public class Visit : BaseEntity
{
    [Key]
    public int Id { get; set; }

    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;

    /*
     * TODO: why i even use sortedDictionary
     *
     *
     *  public class Entry {
        public int Outer { get; set; }
        public int Inner { get; set; }
        public string Value { get; set; }
        }
        public class GridContainer {
            public List<Entry> Entries { get; set; } = new();
        }
     *
     */

    [Column(TypeName = "jsonb")]
    public SortedDictionary<string, string> Fields { get; set; } = [];

    public int TemplateId { get; set; }
    public VisitTemplate Template { get; set; } = null!;

    public int MedicId { get; set; }
    public Medic Medic { get; set; } = null!;

    public int? TriageId { get; set; }
    public Triage? Triage { get; set; }

    public bool FollowsTemplate(VisitTemplate template)
    {
        foreach (var key in Fields.Keys)
        {
            var idxs = key.Split('-');
            if (idxs.Length != 2)
                return false;

            if (!uint.TryParse(idxs[0], out uint rowIdx) || !uint.TryParse(idxs[1], out uint colIdx))
                return false;

            if (rowIdx >= template.Titles.Count || colIdx >= template.Titles[(int)rowIdx].Count)
                return false;

            // do not allow col index be 0 if title has subtitles
            if (template.Titles[(int)rowIdx].Count > 1 && colIdx == 0)
                return false;
        }
        return true;
    }
}
