
let watchId = null;
function setPortalMsg(text, type=''){
  const el = document.getElementById('riderPortalMsg');
  if (!el) return;
  el.textContent = text;
  el.className = 'notice';
  if (type === 'success') el.classList.add('success');
  if (type === 'error') el.classList.add('error');
}
async function postLocation(riderId, status, lat, lng){
  const res = await fetch('/api/rider-location', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ rider_id: riderId, status, lat, lng })
  });
  const data = await res.json();
  if(!res.ok) throw new Error(data.error || 'Location update failed');
  return data;
}
function stopSharing(){
  if (watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  document.getElementById('gpsState').textContent = 'Stopped';
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('startGpsBtn')?.addEventListener('click', () => {
    const riderInput = document.getElementById('portalRiderId');
    const riderIdRaw = riderInput ? riderInput.value.trim() : "";
    if (riderIdRaw && !/^[0-9a-fA-F-]{8,}$/.test(riderIdRaw)) {
      setPortalMsg('Rider ID format looks wrong. Use the generated rider UUID from Admin or Supabase.', 'error');
      return;
    }
    const riderId = document.getElementById('portalRiderId').value.trim();
    const status = document.getElementById('portalRiderStatus').value.trim() || 'busy';
    if (!riderId) {
      setPortalMsg('Enter a rider ID first.', 'error');
      return;
    }
    if (!navigator.geolocation) {
      setPortalMsg('Geolocation is not supported on this device.', 'error');
      return;
    }
    setPortalMsg('Requesting GPS permission...');
    watchId = navigator.geolocation.watchPosition(async (pos) => {
      try {
        await postLocation(riderId, status, pos.coords.latitude, pos.coords.longitude);
        document.getElementById('gpsState').textContent = 'Live';
        document.getElementById('gpsLastSeen').textContent = new Date().toLocaleTimeString();
        setPortalMsg('Location shared successfully.', 'success');
      } catch (e) {
        setPortalMsg(e.message || 'Location update failed.', 'error');
      }
    }, (err) => {
      setPortalMsg(err.message || 'GPS permission denied.', 'error');
    }, { enableHighAccuracy:true, maximumAge:5000, timeout:10000 });
  });

  document.getElementById('stopGpsBtn')?.addEventListener('click', stopSharing);
});
