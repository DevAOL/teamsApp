using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace TeamAPI.Models
{
    public enum WeekDay
    {
        [Display(Name = "Måndag")]
        monday = 1,
        [Display(Name = "Tirsdag")]
        tuesday = 2,
        [Display(Name = "Onsdag")]
        wednesday = 3,
        [Display(Name = "Torsdag")]
        thursday = 4,
        [Display(Name = "Fredag")]
        friday = 5,
        [Display(Name = "Lørdag")]
        saturday = 6,
        [Display(Name = "Søndag")]
        sunday = 7,
    }
}
