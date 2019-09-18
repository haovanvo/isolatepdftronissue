using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using pdftron.SDF;

namespace server2.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ValuesController : ControllerBase
  {
    private IHostingEnvironment _environment;
    public ValuesController(IHostingEnvironment environment)
    {
      _environment = environment;
    }

    // GET api/values
    [HttpGet]
    public ActionResult<IEnumerable<string>> Get()
    {
      return new string[] { "value1", "value2" };
    }

    // GET api/values/5
    [HttpGet("{id}")]
    public ActionResult<string> Get(int id)
    {
      return "value";
    }

    // POST api/values
    [HttpPost]
    public void Post([FromBody] string value)
    {
    }

    // PUT api/values/5
    [HttpPut("{id}")]
    public void Put(int id, [FromBody] string value)
    {
    }

    // DELETE api/values/5
    [HttpDelete("{id}")]
    public void Delete(int id)
    {
    }

    /// <summary>
    /// Return binary content of the requested file
    /// </summary>
    /// <param name="fsId"></param>
    /// <returns></returns>
    [HttpGet("read")]
    public IActionResult Read()
    {
      try
      {
        bool xfaChecked = false;
        bool containsXFA = false;

        string filePath = Path.Combine(_environment.ContentRootPath, "acrobat_pdfl_api_reference.pdf");
        string linearFilePath = Path.Combine(_environment.ContentRootPath, "linearDocument", "acrobat_pdfl_api_reference.pdf");

        if (!System.IO.File.Exists(linearFilePath))
        {
          var dir = System.IO.Path.GetDirectoryName(linearFilePath);
          System.IO.Directory.CreateDirectory(dir);

          using (pdftron.PDF.PDFDoc doc = new pdftron.PDF.PDFDoc(filePath))
          {
            doc.InitSecurityHandler();
            pdftron.SDF.SDFDoc.SaveOptions saveOptions = 0;

            Obj acro_form = doc.GetAcroForm();
            if (acro_form != null)
            {
              var xfaForm = acro_form.FindObj("XFA");
              xfaChecked = true;
              containsXFA = (xfaForm != null);
            }

            // Linearize the pdf document to support for incremental download.
            if (!doc.IsLinearized())
            {
              saveOptions = pdftron.SDF.SDFDoc.SaveOptions.e_linearized;
            }
            else
            {
              saveOptions = pdftron.SDF.SDFDoc.SaveOptions.e_incremental;
            }

            doc.Save(linearFilePath, saveOptions);
          }
        }

        return PhysicalFile(linearFilePath, "application/octet-stream", true);
      }
      catch (Exception ex)
      {
        return StatusCode((int)HttpStatusCode.InternalServerError, ex);
      }
    }
  }
}
