using System.ComponentModel.DataAnnotations;

namespace TeamAPI.Models
{
    public enum TeamType
    {
        [Display(Name = "Liga Damer")]
        liga = 1,
        [Display(Name = "Øst 4-Damer")]
        division = 2,
        [Display(Name = "Øst Række Damer")]
        row = 3,
        [Display(Name = "Den fri")]
        free = 4,
    }
}
