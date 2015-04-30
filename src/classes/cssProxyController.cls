public with sharing class cssProxyController {
  public String content {get;set;}

	public cssProxyController() {
    PageReference pr = new PageReference('/resource/'+ String.valueof(DateTime.now().getTime()) +'/Topco/css/site.css');
    content = pr.getContent().toString();

	}
}