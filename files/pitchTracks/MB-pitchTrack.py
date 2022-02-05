import numpy as np
import json

## GLOBAL VARIABLES (to be filled)
pitchTrackFile = './Rithvik Raja - Emani Migula_pitch.txt' # Path to the pitch track file
jsonFile = './4e2ee259-5448-4843-b29c-fc74906376f6_pitchTrack.json' # Path (including file name and .json extesion) of the returned file
sadja = 130.812783 # Pitch of sa in Hz

print('Processing', pitchTrackFile.split('/')[-1])
print('Sa:', round(sadja, 3))

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
with open(pitchTrackFile, 'r') as f:
    data = f.readlines()
len(data)
pitchTrack = json.loads(data[0])

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
print('Saved to', jsonFile)
