import pyshark

pcap = pyshark.FileCapture('sus.pcap', display_filter='http')

# reqs = {}
full = None
applied = None

for p in pcap:
    if p.http.get_field('request'):
        # reqs[p.frame_info.number] = p
        start, end = map(int, p.http.get_field_by_showname('Range').binary_value.split(b': bytes=')[-1].strip().decode().split('-'))
        print(start, end)
    elif p.http.get_field('response'):
        # p.http.request_in
        range_info = p.http.get_field_by_showname('Content-Range').binary_value.split(b': bytes')[-1].strip()
        cur_range, total = range_info.decode().split('/')
        total = int(total)
        start, end = map(int, cur_range.split('-'))
        if full is None:
            full = [0] * total
            applied = [0] * total
        else:
            assert len(full) == total
        content = bytes.fromhex(p.tcp.payload.replace(':', '')).split(b'\r\n\r\n', maxsplit=1)[-1]
        assert len(content) == end - start + 1
        for i, v in enumerate(content):
            full[start + i] = v
            applied[start + i] = 1

pcap.close()
exit()
open('sus.png', 'wb').write(bytes(full))

for i, v in enumerate(applied):
    if not v:
        print(i)
