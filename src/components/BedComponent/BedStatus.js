import {Text, View, StyleSheet, ScrollView, Image} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../Pixel/index';
import {COLORS, Fonts} from '../../utils';
import {useTheme} from '../../utils/ThemeProvider';
import sleeping from '../../images/sleeping.png';

const BedStatus = ({BedTypeData, bedData}) => {
  const {theme} = useTheme();

  return (
    <View style={[styles.safeAreaStyle, {backgroundColor: theme.grayColor}]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: hp(12)}}>
        <Text style={styles.botStatusText}>Bed Status</Text>
        <View style={styles.bedTitleView}>
          <Image style={styles.assignedImage} source={sleeping} />
          <Text style={styles.bedTitleText}>Assigned Beds</Text>
          <Image
            style={[styles.availableImage, {marginLeft: wp(6)}]}
            source={sleeping}
          />
          <Text style={styles.bedTitleText}>Available Beds</Text>
        </View>
        <View style={[styles.activeView, {backgroundColor: COLORS.white}]}>
          {BedTypeData.map(item => {
            const filteredBeds = bedData.filter(
              bed => bed.bed_type === item.title,
            );
            return (
              <>
                <Text style={styles.bedTypeText}>{item.title}</Text>
                <View style={styles.bedView}>
                  {filteredBeds.length > 0 ? (
                    filteredBeds.map(item1 => {
                      return (
                        <View style={styles.bedSpecificView}>
                          <Image
                            style={
                              item1.availablility === 'Available'
                                ? styles.availableImage
                                : styles.assignedImage
                            }
                            source={sleeping}
                          />
                          <Text
                            style={[
                              styles.bedNameText,
                              {
                                color:
                                  item1.availablility === 'Available'
                                    ? COLORS.greenColor
                                    : COLORS.errorColor,
                              },
                            ]}>
                            {item1.name}
                          </Text>
                        </View>
                      );
                    })
                  ) : (
                    <View style={styles.emptyView}>
                      <Text style={styles.emptyText}>No Bed Available</Text>
                    </View>
                  )}
                </View>
              </>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default BedStatus;

const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  activeView: {
    width: '94%',
    minHeight: hp(35),
    maxHeight: hp(80),
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    paddingBottom: hp(3),
    borderRadius: wp(3),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  botStatusText: {
    fontSize: hp(2.6),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
    marginHorizontal: wp(4),
    marginTop: hp(3),
  },
  bedTitleView: {
    flexDirection: 'row',
    marginHorizontal: wp(4),
    marginVertical: hp(2),
    alignItems: 'center',
  },
  availableImage: {
    width: wp(8),
    height: hp(4),
    resizeMode: 'contain',
    tintColor: COLORS.greenColor,
  },
  assignedImage: {
    width: wp(8),
    height: hp(4),
    resizeMode: 'contain',
    tintColor: COLORS.errorColor,
  },
  bedTitleText: {
    fontSize: hp(2.1),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    marginLeft: wp(2),
  },
  bedNameText: {
    fontSize: hp(2.1),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  bedTypeText: {
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    marginVertical: hp(2),
    marginHorizontal: wp(2),
  },
  bedView: {
    width: '95%',
    paddingVertical: hp(3),
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: wp(3),
    borderWidth: 0.5,
    borderColor: COLORS.black,
    alignSelf: 'center',
  },
  bedSpecificView: {
    width: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyView: {
    width: '92%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
});
