using Microsoft.EntityFrameworkCore;
using TeamModel;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<TeamDataContext>(options => options
    .UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), sqlServerOptions =>
    {
        sqlServerOptions.EnableRetryOnFailure();
        sqlServerOptions.MigrationsAssembly("TeamModel");
}));

var allowOrigin = "AllowOrigin";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowOrigin,
                      policy =>
                      {
                          policy.WithOrigins("https://localhost",
                                             "https://localhost:3000")
                                             .AllowAnyHeader()
                                             .AllowAnyMethod()
                                             .AllowCredentials();
                      });
});

builder.Services.AddAutoMapper(configuration => configuration
    .AddProfile<AutoMapperProfiles>(), typeof(IStartup));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseCors(allowOrigin);

app.UseAuthorization();

app.MapControllers();

app.Run();
