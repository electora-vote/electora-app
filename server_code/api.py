import anvil.server
import anvil.http

_base_url = "https://fake-courageous-theory.anvil.app/_/api/"


@anvil.server.callable
def encyrpt(proof, vote, timestamp):
    return anvil.http.request(
        f"{_base_url}encrypt?prooof={proof}&vote={vote}&timestamp={timestamp}"
    )
