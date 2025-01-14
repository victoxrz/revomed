using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Domain.Entities.Users;


namespace Infrastructure.BL
{
    public class PacientiDbContext : DbContext
    {
        public PacientiDbContext(DbContextOptions<PacientiDbContext> options) 
            :base (options)
        {
        
        }


        public DbSet<Pacient> Patienti { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //base.OnModelCreating(modelBuilder);
        }
    }
}
