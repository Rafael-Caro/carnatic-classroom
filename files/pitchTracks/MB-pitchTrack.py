import numpy as np
import json

## GLOBAL VARIABLES (to be filled)
pitchTrackFile = './136_Mati_Matiki.csv' # Path to the pitch track file
jsonFile = './dc1d1aa8-0ee2-4d2b-a506-c62fa00779ea_pitchTrack.json' # Path (including file name and .json extesion) of the returned file
sadja = 191.521 # Pitch of sa in Hz

## FUNCTIONS
def herz2cent(p, r):
    """
    Convert pitch in Hz to cents with respect to a reference pitch

    Args:
        p (float): the given pitch
        r (float): the reference pitch

    Returns:
        c (float): cents distance

    >>> herz2cent(440, 220)
    1200.0

    >>> herz2cent(220, 440)
    -1200.0
    """
    return np.rint(1200 * np.log2(p/r))

def centsOrSilence(p, r):
    """
    If the given pitch p is equal or smaller than 0, return the str 'r'.
    Otherwise, return the cents from a given reference r

    Args:
        p (float): the given pitch
        r (float): the reference pitch

    >>> centsOrSilence(0, 220)
    'r'

    >>> centsOrSilence(440, 220)
    1200.0
    """
    if p <= 0:
        return 's'
    else:
        return int(herz2cent(p, r))

## PITCH TRACK CONVERSION
# Load pitch track (check that the delimiter is correct!)
pitchTrack = np.genfromtxt(pitchTrackFile, delimiter=', ')
print(pitchTrack)

# Convert the pitch track into the desired format
MB_pitchTrack = {}

for i in range(len(pitchTrack)):
    v = centsOrSilence(pitchTrack[i][1], sadja)
    if v == 's':
        MB_pitchTrack[round(pitchTrack[i][0], 2)] = 's'
    else:
        MB_pitchTrack[round(pitchTrack[i][0], 2)] = v

# Dump the newly formated pitch track as a json file
json.dump(MB_pitchTrack, open(jsonFile, 'w'), separators=(',',':'))
