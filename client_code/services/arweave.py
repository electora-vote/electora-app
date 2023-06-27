from anvil.js import import_from
from anvil.js import window

ethers = import_from("ethers").ethers
WebBundlr = window.Bundlr.default

# TODO - handle window.etherum is not defined
provider = ethers.BrowserProvider(window.ethereum);
signer = provider.getSigner();

provider.getSigner = lambda *args: signer
 
bundlr = WebBundlr("https://node1.bundlr.network", "matic", provider);
bundlr.ready()

print(dir(bundlr))
