using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace server2
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;

      //Initialize PDFTron PDFNet SDK
      var encodedKey = "ZGVtbzprbmd1eWVuNzJAY3NjLmNvbTo3MjVkZjEzZDAxY2NkNzM4ZjRkMGMyNmNlNzk0YTZhMmJhM2JjZDU5N2Q2YmE3NGJjYw==";
      byte[] data = System.Convert.FromBase64String(encodedKey);
      string decodedKey = Encoding.UTF8.GetString(data);
      pdftron.PDFNet.Initialize(decodedKey);
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddCors(builder =>
      {
        builder.AddPolicy("all", options =>
        {
          options.AllowAnyOrigin()
            .AllowAnyHeader()
            .WithExposedHeaders(new string[] { "Accept-Ranges", "Content-Encoding", "Content-Length", "Content-Range" })
            .AllowAnyMethod()
            .AllowCredentials()
            .SetPreflightMaxAge(TimeSpan.MaxValue);
        });
      });

      services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        app.UseHsts();
      }

      app.UseCors("all");

      app.UseHttpsRedirection();
      app.UseMvc();
    }
  }
}
