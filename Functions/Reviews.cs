using Functions.Database;

namespace Functions;

 public class Reviews(ILogger<PlaceHolder> logger, ICosmos cosmos)
 {
     [Function("PlaceHolder")]
     public async Task<HttpResponseData> Run(
         [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req)
     {
         var client = cosmos.GetClient();

         var container = client.GetContainer(
             "blind-review", 
              "users"); 
         
         var reviewer= await container.ReadItemAsync<User>("5c4f31df-69e9-4fce-9dc9-66def9414e37", new PartitionKey());
         var reviewee= await container.ReadItemAsync<User>("5c4f31df-69e9-4fce-9dc9-66def9414e37", new PartitionKey());
        
         // read item
         // update 
         var res = req.CreateResponse(HttpStatusCode.OK);
         await res.WriteStringAsync("Worked");
         return res;
     }
 }
