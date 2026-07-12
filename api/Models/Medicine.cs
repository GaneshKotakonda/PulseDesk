using System.ComponentModel.DataAnnotations;

public class Medicine
{   [Key]
    public int Id { get; set; }
    public string name { get; set; }="";
    public string Category { get; set; } = "";

    public int Stock { get; set; }
    public decimal Price { get; set; }

}